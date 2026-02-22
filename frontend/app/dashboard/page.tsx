"use client";

import React, { useState, useRef, useEffect } from "react";
import AiAnalystWidget from "@/components/AiAnalystWidget";
import { Leaf, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react";

interface Ticker {
  symbol: string;
  price: string;
  signal: "BUY" | "HOLD" | "SELL";
  conf: number;
  trend: "up" | "down" | "flat";
}

interface NewsItem {
  title: string;
  url: string;
  publisher: string;
}

const INITIAL_TICKERS: Ticker[] = [
  { symbol: "MSFT",  price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
  { symbol: "NVDA",  price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
  { symbol: "GOOGL", price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
  { symbol: "AAPL",  price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
  { symbol: "TSLA",  price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
  { symbol: "AMZN",  price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
  { symbol: "META",  price: "Loading...", signal: "HOLD", conf: 50, trend: "flat" },
];

const COMPANY_NAMES: Record<string, string> = {
  MSFT: "microsoft",
  NVDA: "nvidia",
  GOOGL: "alphabet",
  AAPL: "apple",
  TSLA: "tesla",
  AMZN: "amazon",
  META: "meta",
};

const SIGNAL_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
  BUY:  { bg: "linear-gradient(145deg,#7c3aed,#4c1d95)", text: "white", glow: "rgba(124,58,237,0.35)" },
  HOLD: { bg: "linear-gradient(145deg,#9ca3af,#6b7280)", text: "white", glow: "rgba(107,114,128,0.25)" },
  SELL: { bg: "linear-gradient(145deg,#a78bfa,#7c3aed)", text: "white", glow: "rgba(167,139,250,0.35)" },
};

function TrendIcon({ trend, size = 32 }: { trend: string; size?: number }) {
  if (trend === "up")   return <TrendingUp  width={size} height={size} style={{ color: "#7c3aed", opacity: 0.7 }} />;
  if (trend === "down") return <TrendingDown width={size} height={size} style={{ color: "#a78bfa", opacity: 0.8 }} />;
  return <Minus width={size} height={size} style={{ color: "#9ca3af", opacity: 0.6 }} />;
}

function determineTrend(signal: string, confidence: number): "up" | "down" | "flat" {
  if (signal === "BUY" && confidence > 60) return "up";
  if (signal === "SELL" && confidence > 60) return "down";
  return "flat";
}

export default function DashboardPage() {
  const [activeIdx, setActiveIdx] = useState(3);
  const [tickers, setTickers] = useState<Ticker[]>(INITIAL_TICKERS);
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch live prices and ML predictions
  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const symbols = INITIAL_TICKERS.map(t => t.symbol).join(',');
        const response = await fetch(`/api/stock-predictions?symbols=${symbols}`);
        const result = await response.json();
        if (result.data) {
          const updatedTickers = INITIAL_TICKERS.map(ticker => {
            const predictionData = result.data[ticker.symbol];
            if (predictionData) {
              return {
                ...ticker,
                price: predictionData.price > 0 ? predictionData.price.toFixed(2) : "N/A",
                signal: predictionData.signal as "BUY" | "HOLD" | "SELL",
                conf: predictionData.confidence,
                trend: determineTrend(predictionData.signal, predictionData.confidence),
              };
            }
            return { ...ticker, price: "N/A" };
          });
          setTickers(updatedTickers);
        }
      } catch (error) {
        console.error("❌ Error fetching predictions:", error);
        setTickers(INITIAL_TICKERS.map(t => ({ ...t, price: "Error" })));
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
    const interval = setInterval(fetchPredictions, 60000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(tickers.length - 1, i + 1));

  const activeTicker = tickers[activeIdx] ?? tickers[0];

  // Fetch news for active ticker — re-runs when ticker changes
  useEffect(() => {
    setNews([]);
    fetch(`http://127.0.0.1:8000/api/news?ticker=${activeTicker.symbol}`)
      .then(res => res.json())
      .then(data => setNews(data.news))
      .catch(() => console.log("News fetch failed"));
  }, [activeTicker.symbol]);

  // Filter news to only show articles mentioning the company
  const filteredNews = news.filter(item => {
    const title = item.title.toLowerCase();
    const symbol = activeTicker.symbol.toLowerCase();
    const companyName = COMPANY_NAMES[activeTicker.symbol] ?? symbol;
    return title.includes(symbol) || title.includes(companyName);
  });

  // Fall back to unfiltered if nothing matched
  const displayNews = filteredNews.length > 0 ? filteredNews.slice(0, 3) : news.slice(0, 3);

  const visibleRange = 1;
  const visible = tickers.map((t, i) => ({
    ...t,
    offset: i - activeIdx,
    visible: Math.abs(i - activeIdx) <= visibleRange + 0.5,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 50%, #ddd6fe 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1600px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "240px 1fr 360px",
          gap: "24px",
        }}
      >
        {/* ── Left: Brand & Nav ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="glass-card" style={{ padding: "24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <Leaf style={{ color: "#6d28d9", width: 32, height: 32 }} strokeWidth={2.5} />
              <span className="font-display" style={{ fontSize: "28px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.03em" }}>
                Finbud
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#7c5cbf", lineHeight: 1.4 }}>
              AI-powered stock intelligence dashboard with real-time ML predictions
            </p>
          </div>

          <div className="glass-card" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {[
              { label: "Dashboard", active: true },
              { label: "Portfolio",  active: false },
              { label: "Watchlist",  active: false },
              { label: "Analytics",  active: false },
            ].map((item) => (
              <button
                key={item.label}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background: item.active ? "linear-gradient(145deg,#7c3aed,#6d28d9)" : "transparent",
                  color: item.active ? "white" : "#6b7280",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <div style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: loading ? "#fbbf24" : "#10b981",
                animation: loading ? "pulse 2s infinite" : "none",
              }} />
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e0a3c" }}>ML Service</span>
            </div>
            <p style={{ fontSize: "11px", color: "#7c5cbf", lineHeight: 1.4 }}>
              {loading ? "Calculating predictions..." : "Live predictions active"}
            </p>
          </div>
        </div>

        {/* ── Center: Carousel ── */}
        <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 className="font-display" style={{ fontSize: "24px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                Top Stocks
              </h2>
              <p style={{ fontSize: "13px", color: "#7c5cbf" }}>ML-powered buy/sell signals updated in real-time</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={prev} disabled={activeIdx === 0} className="glass-card"
                style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "50%", cursor: activeIdx === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: activeIdx === 0 ? 0.3 : 1 }}>
                <ChevronLeft width={20} height={20} style={{ color: "#6d28d9" }} />
              </button>
              <button onClick={next} disabled={activeIdx === tickers.length - 1} className="glass-card"
                style={{ width: "40px", height: "40px", padding: 0, border: "none", borderRadius: "50%", cursor: activeIdx === tickers.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: activeIdx === tickers.length - 1 ? 0.3 : 1 }}>
                <ChevronRight width={20} height={20} style={{ color: "#6d28d9" }} />
              </button>
            </div>
          </div>

          {/* Cards */}
          <div style={{ position: "relative", height: "280px", flexShrink: 0 }}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {visible.map((ticker, i) => {
                const abs = Math.abs(ticker.offset);
                if (abs > 1) return null;
                const isCenter = ticker.offset === 0;
                const colors = SIGNAL_COLORS[ticker.signal];
                const cardW = isCenter ? 220 : 175;
                const cardH = isCenter ? 230 : 182;
                const translateX = ticker.offset * 195;
                const scale = isCenter ? 1 : 0.88;
                const zIndex = isCenter ? 10 : 5;
                const opacity = isCenter ? 1 : 0.82;

                return (
                  <div
                    key={ticker.symbol}
                    onClick={() => !isCenter && setActiveIdx(activeIdx + ticker.offset)}
                    style={{
                      position: "absolute", top: "50%", left: "50%",
                      width: `${cardW}px`, height: `${cardH}px`,
                      transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                      transition: "all 0.4s cubic-bezier(0.34,1.4,0.64,1)",
                      zIndex, opacity, cursor: isCenter ? "default" : "pointer",
                    }}
                  >
                    <div className="glass-card" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", gap: isCenter ? "6px" : "4px" }}>
                      <h3 className="font-display" style={{ fontSize: isCenter ? "22px" : "17px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.02em" }}>
                        {ticker.symbol}
                      </h3>
                      <p style={{ fontSize: isCenter ? "13px" : "11px", color: "#7c5cbf", fontWeight: 400, marginBottom: isCenter ? "6px" : "4px" }}>
                        {ticker.price !== "Loading..." && ticker.price !== "Error" ? `$${ticker.price}` : ticker.price} USD
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: isCenter ? "14px" : "10px" }}>
                        <div style={{
                          width: isCenter ? "88px" : "64px", height: isCenter ? "88px" : "64px",
                          borderRadius: "50%", background: colors.bg,
                          boxShadow: `0 0 ${isCenter ? 24 : 16}px ${colors.glow}`,
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                          gap: "2px", transition: "all 0.3s ease",
                        }}>
                          <span style={{ fontSize: isCenter ? "13px" : "10px", fontWeight: 700, lineHeight: 1, color: "white" }}>{ticker.signal}</span>
                          <span style={{ fontSize: isCenter ? "22px" : "16px", fontWeight: 800, lineHeight: 1.1, color: "white" }}>{ticker.conf}%</span>
                        </div>
                        <TrendIcon trend={ticker.trend} size={isCenter ? 30 : 22} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexShrink: 0, marginTop: "-8px" }}>
            {tickers.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                width: i === activeIdx ? "20px" : "6px", height: "6px", borderRadius: "100px",
                background: i === activeIdx ? "#6d28d9" : "rgba(109,40,217,0.25)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
              }} />
            ))}
          </div>

          {/* Quick News */}
          <div style={{ marginTop: "20px" }}>
            <h3 className="font-display" style={{ fontSize: "14px", fontWeight: 700, color: "#1e0a3c", letterSpacing: "-0.01em", marginBottom: "10px" }}>
              {activeTicker.symbol} News
            </h3>
            <div style={{ display: "flex", gap: "12px" }}>
              {news.length > 0 ? displayNews.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card"
                  style={{ flex: 1, padding: "16px 18px", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: "#3b1f6e", lineHeight: 1.4, textDecoration: "none", display: "block" }}
                >
                  <div style={{ marginBottom: "6px" }}>{item.title}</div>
                  <div style={{ fontSize: "11px", color: "#a78bfa", fontWeight: 400 }}>{item.publisher}</div>
                </a>
              )) : (
                ["Loading news...", "Loading news...", "Loading news..."].map((h, idx) => (
                  <div key={idx} className="glass-card" style={{ flex: 1, padding: "16px 18px", fontSize: "13px", color: "#a78bfa" }}>{h}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── Right: AI Insights ── */}
        <div>
          <AiAnalystWidget
            ticker={activeTicker.symbol}
            prediction={activeTicker.signal}
            confidence={activeTicker.conf}
            price={parseFloat(activeTicker.price) || 0}
          />
        </div>
      </div>
    </div>
  );
}