import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export function InfoTooltip({ text, className = "" }: InfoTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle className={`inline h-3.5 w-3.5 text-muted-foreground cursor-help ml-1 ${className}`} />
      </TooltipTrigger>
      <TooltipContent className="max-w-[240px] text-sm" side="top">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
