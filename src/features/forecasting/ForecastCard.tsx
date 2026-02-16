import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ConfidenceScore } from "@/features/confidence/ConfidenceScore";
import { Sparkline } from "./Sparkline";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import type { StockForecasts } from "@/data/stocks";

type Horizon = "tomorrow" | "nextWeek" | "monthly";

const horizonLabels: Record<Horizon, string> = {
  tomorrow: "Tomorrow",
  nextWeek: "Next Week",
  monthly: "Monthly",
};

const horizonTooltips: Record<Horizon, string> = {
  tomorrow: "What we think the price will be at market close tomorrow.",
  nextWeek: "Our best guess for the price 7 days from now.",
  monthly: "A longer-range prediction for ~30 days out. Less certain, but shows the bigger trend.",
};

interface ForecastCardProps {
  forecasts: StockForecasts;
  sparkline: number[];
  currentPrice: number;
}

function DirectionIcon({ direction }: { direction: "up" | "down" | "flat" }) {
  if (direction === "up") return <TrendingUp className="h-5 w-5 text-gain" />;
  if (direction === "down") return <TrendingDown className="h-5 w-5 text-loss" />;
  return <Minus className="h-5 w-5 text-flat" />;
}

export function ForecastCard({ forecasts, sparkline, currentPrice }: ForecastCardProps) {
  const [horizon, setHorizon] = useState<Horizon>("tomorrow");
  const forecast = forecasts[horizon];
  const priceDiff = forecast.predictedPrice - currentPrice;
  const priceDiffPercent = ((priceDiff / currentPrice) * 100).toFixed(2);

  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center">
          Price Forecast
          <InfoTooltip text="Our model predicts where the price might go based on recent patterns and news. This is not financial advice." />
        </h3>
      </div>

      {/* Segmented control */}
      <div className="flex bg-muted rounded-lg p-0.5 mb-5">
        {(Object.keys(horizonLabels) as Horizon[]).map((h) => (
          <button
            key={h}
            onClick={() => setHorizon(h)}
            className={`flex-1 text-xs font-medium py-2 rounded-md transition-all ${
              horizon === h
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {horizonLabels[h]}
          </button>
        ))}
      </div>

      {/* Forecast content */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <DirectionIcon direction={forecast.direction} />
            <span className="text-2xl font-bold font-mono">
              ${forecast.predictedPrice.toFixed(2)}
            </span>
          </div>
          <p className={`text-sm font-mono ${priceDiff >= 0 ? "text-gain" : "text-loss"}`}>
            {priceDiff >= 0 ? "+" : ""}{priceDiff.toFixed(2)} ({priceDiffPercent}%)
          </p>
          <p className="text-xs text-muted-foreground mt-1 flex items-center">
            {horizonTooltips[horizon]}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Sparkline data={sparkline} width={100} height={48} />
        </div>
      </div>

      {/* Confidence */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">How confident is the model?</p>
        <ConfidenceScore score={forecast.confidence} size="lg" />
      </div>
    </div>
  );
}
