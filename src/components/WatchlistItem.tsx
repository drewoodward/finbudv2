import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Sparkline } from "@/features/forecasting/Sparkline";
import { ConfidenceScore } from "@/features/confidence/ConfidenceScore";
import type { StockData } from "@/data/stocks";

interface WatchlistItemProps {
  stock: StockData;
}

export function WatchlistItem({ stock }: WatchlistItemProps) {
  const navigate = useNavigate();
  const { quote, forecasts, sparkline } = stock;
  const isUp = quote.change >= 0;

  return (
    <button
      onClick={() => navigate(`/stock/${quote.symbol}`)}
      className="w-full glass-card p-4 flex items-center gap-4 hover:border-primary/30 transition-all group"
    >
      {/* Symbol + name */}
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{quote.symbol}</p>
        <p className="text-xs text-muted-foreground truncate">{quote.name}</p>
      </div>

      {/* Sparkline */}
      <div className="hidden sm:block flex-shrink-0">
        <Sparkline data={sparkline} width={60} height={28} />
      </div>

      {/* Price + change */}
      <div className="text-right flex-shrink-0 w-24">
        <p className="font-mono text-sm font-medium">${quote.price.toFixed(2)}</p>
        <p className={`text-xs font-mono ${isUp ? "text-gain" : "text-loss"}`}>
          {isUp ? "+" : ""}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
        </p>
      </div>

      {/* Tomorrow forecast + confidence */}
      <div className="hidden md:flex flex-col items-end flex-shrink-0 w-28 gap-1">
        <div className="flex items-center gap-1">
          {forecasts.tomorrow.direction === "up" && <TrendingUp className="h-3 w-3 text-gain" />}
          {forecasts.tomorrow.direction === "down" && <TrendingDown className="h-3 w-3 text-loss" />}
          {forecasts.tomorrow.direction === "flat" && <Minus className="h-3 w-3 text-flat" />}
          <span className="text-xs text-muted-foreground">Tomorrow</span>
        </div>
        <ConfidenceScore score={forecasts.tomorrow.confidence} size="sm" />
      </div>
    </button>
  );
}
