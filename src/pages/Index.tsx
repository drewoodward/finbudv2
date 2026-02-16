import { AppHeader } from "@/components/AppHeader";
import { WatchlistItem } from "@/components/WatchlistItem";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { watchlistSymbols, stocksData } from "@/data/stocks";
import { TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-3xl">
        {/* Hero */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-1">Good morning 👋</h1>
          <p className="text-muted-foreground text-sm">Here's what's happening with your stocks today.</p>
        </div>

        {/* Watchlist */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-medium">Your Watchlist</h2>
            <InfoTooltip text="Stocks you're tracking. Click any stock to see its forecast and AI analysis." />
          </div>
          <div className="space-y-2">
            {watchlistSymbols.map((symbol) => {
              const stock = stocksData[symbol];
              if (!stock) return null;
              return <WatchlistItem key={symbol} stock={stock} />;
            })}
          </div>
        </section>

        {/* Footer disclaimer */}
        <p className="text-center text-[11px] text-muted-foreground mt-12">
          FinBud is for educational purposes only. Not financial advice. All data is simulated.
        </p>
      </main>
    </div>
  );
};

export default Dashboard;
