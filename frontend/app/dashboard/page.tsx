"use client";

import React, { useState, useRef } from "react";
import AiAnalystWidget from "@/components/AiAnalystWidget";
import { Leaf, TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from "lucide-react";

const TICKERS = [
  { symbol: "MSFT",  price: "415.20", signal: "BUY",  conf: 82, trend: "up"   },
  { symbol: "NVDA",  price: "875.40", signal: "BUY",  conf: 91, trend: "up"   },
  { symbol: "GOOGL", price: "142.20", signal: "HOLD", conf: 65, trend: "flat" },
  { symbol: "AAPL",  price: "175.50", signal: "BUY",  conf: 88, trend: "up"   },
  { symbol: "TSLA",  price: "245.80", signal: "SELL", conf: 40, trend: "down" },
  { symbol: "AMZN",  price: "185.60", signal: "BUY",  conf: 76, trend: "up"   },
  { symbol: "META",  price: "505.30", signal: "HOLD", conf: 58, trend: "flat" },
];

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

export default function DashboardPage() {
  const [activeIdx, setActiveIdx] = useState(3); // AAPL default
  const containerRef = useRef<HTMLDivElement>(null);

  const prev = () => setActiveIdx((i) => Math.max(0, i - 1));
  const next = () => setActiveIdx((i) => Math.min(TICKERS.length - 1, i + 1));

  const activeTicker = TICKERS[activeIdx];

  // How many cards visible: active center + 1 each side
  const visibleRange = 1;
  const visible = TICKERS.map((t, i) => ({
    ...t,
    offset: i - activeIdx,   // -2,-1,0,1,2 relative to center
    visible: Math.abs(i - activeIdx) <= visibleRange + 0.5,
  }));

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 40px 24px",
        position: "relative",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* ── Nav Header ── */}
      <header
        style={{
          width: "100%",
          maxWidth: "900px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "36px",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Leaf style={{ color: "#6d28d9", width: 26, height: 26 }} strokeWidth={2.5} />
          <span
            className="font-display"
            style={{ fontSize: "26px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.03em" }}
          >
            Finbud
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {["Dashboard", "Watchlist", "Widgets", "Profile"].map((item, i) => (
            <button
              key={item}
              style={{
                padding: "8px 16px",
                borderRadius: "100px",
                border: "none",
                background: i === 0 ? "rgba(109,40,217,0.10)" : "transparent",
                color: i === 0 ? "#4c1d95" : "#7c5cbf",
                fontSize: "13.5px",
                fontWeight: i === 0 ? 600 : 400,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (i !== 0) (e.target as HTMLElement).style.background = "rgba(109,40,217,0.06)"; }}
              onMouseLeave={(e) => { if (i !== 0) (e.target as HTMLElement).style.background = "transparent"; }}
            >
              {item}
            </button>
          ))}
          <div
            style={{
              marginLeft: "12px",
              padding: "8px 20px",
              background: "rgba(255,255,255,0.65)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.85)",
              borderRadius: "100px",
              fontSize: "13px",
              color: "#7c5cbf",
              fontFamily: "'DM Sans', sans-serif",
              cursor: "text",
              boxShadow: "0 2px 8px rgba(109,40,217,0.08)",
            }}
          >
            Search
          </div>
        </nav>
      </header>

      {/* ── Main Content ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflow: "hidden",
        }}
      >
        {/* ── Ticker Carousel ── */}
        <div
          style={{
            position: "relative",
            height: "240px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Left Arrow */}
          <button
            onClick={prev}
            disabled={activeIdx === 0}
            style={{
              position: "absolute", left: "-8px", zIndex: 20,
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 16px rgba(109,40,217,0.12)",
              cursor: activeIdx === 0 ? "not-allowed" : "pointer",
              opacity: activeIdx === 0 ? 0.4 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              color: "#4c1d95",
            }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={next}
            disabled={activeIdx === TICKERS.length - 1}
            style={{
              position: "absolute", right: "-8px", zIndex: 20,
              width: "40px", height: "40px", borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 4px 16px rgba(109,40,217,0.12)",
              cursor: activeIdx === TICKERS.length - 1 ? "not-allowed" : "pointer",
              opacity: activeIdx === TICKERS.length - 1 ? 0.4 : 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
              color: "#4c1d95",
            }}
          >
            <ChevronRight size={18} />
          </button>

          {/* Cards */}
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {visible.map((ticker, i) => {
              const abs = Math.abs(ticker.offset);
              if (abs > 1) return null;

              const isCenter = ticker.offset === 0;
              const colors = SIGNAL_COLORS[ticker.signal];

              // Card geometry
              const cardW  = isCenter ? 220 : 175;
              const cardH  = isCenter ? 230 : 182;
              const translateX = ticker.offset * 195;
              const scale  = isCenter ? 1 : 0.88;
              const zIndex = isCenter ? 10 : 5;
              const opacity = isCenter ? 1 : 0.82;

              return (
                <div
                  key={ticker.symbol}
                  onClick={() => !isCenter && setActiveIdx(i + (activeIdx - visibleRange))}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: `${cardW}px`,
                    height: `${cardH}px`,
                    transform: `translate(calc(-50% + ${translateX}px), -50%) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: "all 0.45s cubic-bezier(0.34,1.2,0.64,1)",
                    cursor: isCenter ? "default" : "pointer",
                    ...(isCenter ? {} : {}),
                  }}
                  className={isCenter ? "glass-card-elevated" : "glass-card"}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      gap: isCenter ? "6px" : "4px",
                    }}
                  >
                    <h3
                      className="font-display"
                      style={{
                        fontSize: isCenter ? "22px" : "17px",
                        fontWeight: 800,
                        color: "#1e0a3c",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {ticker.symbol}
                    </h3>
                    <p
                      style={{
                        fontSize: isCenter ? "13px" : "11px",
                        color: "#7c5cbf",
                        fontWeight: 400,
                        marginBottom: isCenter ? "6px" : "4px",
                      }}
                    >
                      {ticker.price} USD
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: isCenter ? "14px" : "10px" }}>
                      {/* Signal Circle */}
                      <div
                        style={{
                          width: isCenter ? "88px" : "64px",
                          height: isCenter ? "88px" : "64px",
                          borderRadius: "50%",
                          background: colors.bg,
                          boxShadow: `0 8px 24px ${colors.glow}`,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          color: colors.text,
                          flexShrink: 0,
                          transition: "all 0.3s ease",
                        }}
                      >
                        <span style={{ fontSize: isCenter ? "13px" : "10px", fontWeight: 700, lineHeight: 1 }}>
                          {ticker.signal}
                        </span>
                        <span style={{ fontSize: isCenter ? "22px" : "16px", fontWeight: 800, lineHeight: 1.1 }}>
                          {ticker.conf}%
                        </span>
                        {isCenter && (
                          <span style={{ fontSize: "9px", opacity: 0.75, marginTop: "2px", fontWeight: 400 }}>
                            Confidence
                          </span>
                        )}
                      </div>

                      {/* Trend Icon */}
                      <TrendIcon trend={ticker.trend} size={isCenter ? 30 : 22} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots indicator */}
        <div style={{ display: "flex", justifyContent: "center", gap: "6px", flexShrink: 0, marginTop: "-8px" }}>
          {TICKERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              style={{
                width: i === activeIdx ? "20px" : "6px",
                height: "6px",
                borderRadius: "100px",
                background: i === activeIdx ? "#6d28d9" : "rgba(109,40,217,0.25)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s cubic-bezier(0.34,1.4,0.64,1)",
              }}
            />
          ))}
        </div>

        {/* ── AI Insights ── */}
        <div style={{ flexShrink: 0 }}>
          <AiAnalystWidget
            ticker={activeTicker.symbol}
            prediction={activeTicker.signal}
            confidence={activeTicker.conf}
            price={parseFloat(activeTicker.price)}
          />
        </div>

        {/* ── Quick News ── */}
        <div style={{ flexShrink: 0 }}>
          <h3
            className="font-display"
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#1e0a3c",
              letterSpacing: "-0.01em",
              marginBottom: "10px",
            }}
          >
            Quick News
          </h3>
          <div style={{ display: "flex", gap: "12px" }}>
            {["Fed Rate Decision Today", "Tech Sector Rally Continues", "Oil Prices Stabilize"].map((h) => (
              <div
                key={h}
                className="glass-card"
                style={{
                  flex: 1,
                  padding: "16px 18px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#3b1f6e",
                  lineHeight: 1.4,
                }}
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}