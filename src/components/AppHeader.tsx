import { Link } from "react-router-dom";
import { TickerSearch } from "./TickerSearch";
import { BookOpen } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-20 gap-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center flex-shrink-0">
          <img
            src="/finbud-logo.png"
            alt="FinBud Logo"
            className="h-24 w-auto object-contain"

          />
        </Link>

        <TickerSearch />

        <Link
          to="/learn"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Learn</span>
        </Link>
      </div>
    </header>
  );
}
