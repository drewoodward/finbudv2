import { useParams, Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ForecastCard } from "@/features/forecasting/ForecastCard";
import { AIAnalystWidget } from "@/features/analyst/AIAnalystWidget";
import { getStock } from "@/data/stocks";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

const StockView = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = getStock(symbol ?? "");

  if (!stock) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container py-16 text-center">
          <h1 className="text-xl font-semibold mb-2">Stock not found</h1>
          <p className="text-muted-foreground text-sm mb-4">We don't have data for "{symbol}" yet.</p>
          <Link to="/" className="text-primary text-sm hover:underline">← Back to dashboard</Link>
        </div>
      </div>
    );
  }

  const { quote, forecasts, news, sparkline } = stock;
  const isUp = quote.change >= 0;

  // Generate initial explanation from news
  const explanation = `${quote.name} is ${isUp ? "up" : "down"} ${Math.abs(quote.changePercent).toFixed(2)}% today. ${news[0]?.summary ?? ""} ${news[1] ? `Also, ${news[1].summary.toLowerCase()}` : ""}`;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 max-w-6xl">
        {/* Back + Header */}
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to watchlist
        </Link>

        <div className="mb-6 animate-fade-in">
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{quote.name}</h1>
            <span className="text-sm text-muted-foreground">{quote.symbol}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-3xl font-bold font-mono">${quote.price.toFixed(2)}</span>
            <span className={`text-sm font-mono flex items-center gap-1 ${isUp ? "text-gain" : "text-loss"}`}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isUp ? "+" : ""}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Main layout: Forecast + AI Analyst */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Forecast - takes 3 cols */}
          <div className="lg:col-span-3">
            <ForecastCard forecasts={forecasts} sparkline={sparkline} currentPrice={quote.price} />
          </div>

          {/* AI Analyst - takes 2 cols */}
          <div className="lg:col-span-2">
            <AIAnalystWidget symbol={quote.symbol} news={news} explanation={explanation} />
          </div>
        </div>

        {/* News section */}
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
          Educational only. Not financial advice. All data is simulated.
        </p>
      </main>
    </div>
  );
};

export default StockView;
