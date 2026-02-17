import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchStocks, type StockQuote } from "@/data/stocks";

export function TickerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockQuote[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      setResults(searchStocks(query));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(symbol: string) {
    setQuery("");
    setOpen(false);
    navigate(`/stock/${symbol}`);
  }

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search stocks (AAPL, TSLA, SPY, NVDA)..."
          className="w-full bg-muted rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-popover border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map(r => (
            <button
              key={r.symbol}
              onClick={() => select(r.symbol)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/80 transition-colors text-left"
            >
              <div>
                <span className="font-semibold text-sm">{r.symbol}</span>
                <span className="text-xs text-muted-foreground ml-2">{r.name}</span>
              </div>
              <span className="font-mono text-sm">${r.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
