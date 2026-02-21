"use client";

import { useRouter } from "next/navigation";
import { Leaf, TrendingUp, Zap, Shield, ArrowRight, BarChart2 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh", width: "100vw",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px", position: "relative", overflow: "hidden",
      }}
    >
      {/* ── Decorative blobs ── */}
      <div style={{ position: "absolute", top: "-100px", left: "-80px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,171,252,0.4) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-120px", right: "-80px", width: "550px", height: "550px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "30%", right: "8%", width: "260px", height: "260px", borderRadius: "50%", background: "radial-gradient(circle, rgba(196,181,253,0.28) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Floating stat cards (decorative) ── */}
      <div
        className="glass-card"
        style={{
          position: "absolute", top: "12%", left: "6%",
          padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px",
          animation: "floatA 6s ease-in-out infinite",
          zIndex: 0,
        }}
      >
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#4c1d95)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <TrendingUp size={16} color="white" />
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#7c5cbf", fontWeight: 500 }}>AAPL</div>
          <div className="font-display" style={{ fontSize: "15px", fontWeight: 700, color: "#1e0a3c" }}>BUY 88%</div>
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          position: "absolute", top: "18%", right: "7%",
          padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px",
          animation: "floatB 7s ease-in-out infinite",
          zIndex: 0,
        }}
      >
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#a78bfa,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BarChart2 size={16} color="white" />
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#7c5cbf", fontWeight: 500 }}>NVDA</div>
          <div className="font-display" style={{ fontSize: "15px", fontWeight: 700, color: "#1e0a3c" }}>BUY 91%</div>
        </div>
      </div>

      <div
        className="glass-card"
        style={{
          position: "absolute", bottom: "18%", left: "7%",
          padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px",
          animation: "floatC 8s ease-in-out infinite",
          zIndex: 0,
        }}
      >
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg,#c4b5fd,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={16} color="white" />
        </div>
        <div>
          <div style={{ fontSize: "11px", color: "#7c5cbf", fontWeight: 500 }}>AI Confidence</div>
          <div className="font-display" style={{ fontSize: "15px", fontWeight: 700, color: "#1e0a3c" }}>↑ 12.4%</div>
        </div>
      </div>

      {/* ── Main hero card ── */}
      <div
        className="glass-card-elevated"
        style={{
          width: "100%", maxWidth: "460px",
          padding: "52px 44px",
          display: "flex", flexDirection: "column", alignItems: "center",
          position: "relative", zIndex: 1, textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Leaf style={{ color: "#6d28d9", width: 32, height: 32 }} strokeWidth={2.5} />
          <span className="font-display" style={{ fontSize: "36px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.03em" }}>
            Finbud
          </span>
        </div>

        {/* Tagline */}
        <h1
          className="font-display"
          style={{ fontSize: "22px", fontWeight: 700, color: "#1e0a3c", letterSpacing: "-0.02em", marginBottom: "10px", lineHeight: 1.3 }}
        >
          Invest smarter with<br />
          <span style={{ background: "linear-gradient(135deg,#7c3aed,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            AI-powered signals
          </span>
        </h1>

        <p style={{ fontSize: "14px", color: "#7c5cbf", marginBottom: "32px", lineHeight: 1.6, maxWidth: "320px" }}>
          Real-time Buy/Hold/Sell recommendations with confidence scores, explained by AI in plain English.
        </p>

        {/* Feature row */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "36px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: <TrendingUp size={13} />, label: "Live Signals" },
            { icon: <Zap size={13} />,        label: "AI Insights"  },
            { icon: <Shield size={13} />,     label: "7 Tickers"    },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "6px 14px",
                background: "rgba(109,40,217,0.07)",
                border: "1px solid rgba(109,40,217,0.13)",
                borderRadius: "100px",
                fontSize: "12px", fontWeight: 500, color: "#4c1d95",
              }}
            >
              {icon} {label}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <button
            onClick={() => router.push("/auth/signup")}
            style={{
              width: "100%", padding: "15px", borderRadius: "16px", border: "none",
              background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
              color: "white", fontSize: "15px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: "0 8px 28px rgba(124,58,237,0.32)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 36px rgba(124,58,237,0.42)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.32)"; }}
          >
            Get Started Free <ArrowRight size={16} />
          </button>

          <button
            onClick={() => router.push("/auth/login")}
            style={{
              width: "100%", padding: "15px", borderRadius: "16px",
              border: "1.5px solid rgba(109,40,217,0.18)",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              color: "#4c1d95", fontSize: "15px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              transition: "transform 0.2s, background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.82)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.3)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.18)"; }}
          >
            Log In
          </button>
        </div>
      </div>

      {/* Float animations */}
      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(-14px) rotate(-1deg); }
        }
        @keyframes floatC {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(1.5deg); }
        }
      `}</style>
    </div>
  );
}