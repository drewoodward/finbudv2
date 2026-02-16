import { Link } from "react-router-dom";
import { TickerSearch } from "./TickerSearch";
import { BookOpen } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-14 gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">F</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold text-sm">FinBud</span>
            <span className="text-xs text-muted-foreground ml-1">by Abbyrye</span>
          </div>
        </Link>

        <TickerSearch />

        <Link
          to="/learn"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Learn</span>
        </Link>
      </div>
    </header>
  );
}
