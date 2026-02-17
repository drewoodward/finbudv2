import { InfoTooltip } from "@/components/ui/InfoTooltip";

interface ConfidenceScoreProps {
  score: number; // 0-100
  size?: "sm" | "lg";
}

function getLevel(score: number) {
  if (score >= 70) return { label: "High", color: "bg-confidence-high", textColor: "text-gain" };
  if (score >= 50) return { label: "Medium", color: "bg-confidence-medium", textColor: "text-yellow-400" };
  return { label: "Low", color: "bg-confidence-low", textColor: "text-loss" };
}

export function ConfidenceScore({ score, size = "sm" }: ConfidenceScoreProps) {
  const level = getLevel(score);
  const isLarge = size === "lg";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className={`${isLarge ? "text-2xl" : "text-base"} font-semibold font-mono ${level.textColor}`}>
          {score}%
        </span>
        <span className={`${isLarge ? "text-sm" : "text-xs"} text-muted-foreground`}>sure</span>
        {isLarge && (
          <InfoTooltip text="Higher confidence means the model has seen similar patterns before. It's not a guarantee — just a measure of how often this pattern led to the predicted outcome." />
        )}
      </div>

      {/* Visual bar */}
      <div className={`w-full ${isLarge ? "h-2" : "h-1"} rounded-full bg-muted overflow-hidden`}>
        <div
          className={`h-full rounded-full ${level.color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      {isLarge && (
        <p className="text-xs text-muted-foreground mt-0.5">
          {score >= 70
            ? "The model has seen similar patterns often — this is a relatively confident prediction."
            : score >= 50
              ? "The model has some basis for this prediction, but there's meaningful uncertainty."
              : "The model is less sure here — many factors could change the outcome."}
        </p>
      )}
    </div>
  );
}
