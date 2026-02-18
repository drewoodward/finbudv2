import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { ForecastCard } from "@/features/forecasting/ForecastCard";
import { AIAnalystWidget } from "@/features/analyst/AIAnalystWidget";
import type { StockData } from "@/data/stocks";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

const StockView = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);

      try {
        // Use backend proxy to avoid CORS issues
        const response = await fetch(
          `http://localhost:5001/api/yahoo/${symbol}?interval=1d&range=1mo`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${symbol}`);
        }

        const data = await response.json();
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
        // Get the latest price data
        const latestPrice = meta.regularMarketPrice || quote.close[quote.close.length - 1];
        const previousClose = meta.previousClose || quote.close[quote.close.length - 2];
        const change = latestPrice - previousClose;
        const changePercent = (change / previousClose) * 100;

        // Create stock data object with live data
        const stockData: StockData = {
          quote: {
            symbol: symbol.toUpperCase(),
            name: meta.longName || meta.shortName || symbol,
            price: latestPrice,
            change: change,
            changePercent: changePercent,
          },
          forecasts: {
            tomorrow: {
              predictedPrice: latestPrice * 1.02,
              direction: "up" as const,
              confidence: 65,
            },
            nextWeek: {
              predictedPrice: latestPrice * 1.05,
              direction: "up" as const,
              confidence: 60,
            },
            monthly: {
              predictedPrice: latestPrice * 1.08,
              direction: "up" as const,
              confidence: 55,
            },
          },
          news: [
            {
              headline: `📈 Live data for ${symbol}`,
              summary: `Current: $${latestPrice.toFixed(2)} | ${change >= 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`,
              source: "Yahoo Finance",
              timeAgo: "Live",
            },
            {
              headline: "🔴 Real-time updates",
              summary: "Data from Yahoo Finance via backend proxy",
              source: "FinBud",
              timeAgo: "Now",
            },
          ],
          sparkline: quote.close.slice(-10).filter((c: number) => c !== null),
        };

        setStock(stockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container py-16 text-center">
          <p className="text-muted-foreground text-sm">🔄 Loading live data...</p>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container py-16 text-center">
          <h1 className="text-xl font-semibold mb-2">Unable to load data</h1>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Link to="/" className="text-primary text-sm hover:underline">← Back</Link>
        </div>
      </div>
    );
  }

  const { quote, forecasts, news, sparkline } = stock;
  const isUp = quote.change >= 0;
  const explanation = `${quote.name} is ${isUp ? "up" : "down"} ${Math.abs(quote.changePercent).toFixed(2)}% at $${quote.price.toFixed(2)}.`;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to watchlist
        </Link>

        <div className="mb-6 animate-fade-in">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{quote.name}</h1>
            <span className="text-sm text-muted-foreground">{quote.symbol}</span>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              LIVE
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-bold font-mono">${quote.price.toFixed(2)}</span>
            <span className={`text-sm font-mono flex items-center gap-1 ${isUp ? "text-gain" : "text-loss"}`}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isUp ? "+" : ""}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <ForecastCard forecasts={forecasts} sparkline={sparkline} currentPrice={quote.price} />
          </div>
          <div className="lg:col-span-2">
            <AIAnalystWidget symbol={quote.symbol} news={news} explanation={explanation} />
          </div>
        </div>

        <section className="mt-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent News</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {news.map((item, i) => (
              <div key={i} className="glass-card p-4 hover:border-primary/20 transition-colors">
                <p className="text-sm font-medium leading-snug mb-1">{item.headline}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{item.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{item.source}</span>
                  <span className="text-[10px] text-muted-foreground">{item.timeAgo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <p className="text-center text-[11px] text-muted-foreground mt-12">
          Educational only. Not financial advice. 🔴 Live data from Yahoo Finance.
        </p>
      </main>
    </div>
  );
};

export default StockView;
