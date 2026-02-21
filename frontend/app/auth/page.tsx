"use client";

import { useRouter } from "next/navigation";
import { Leaf, TrendingUp, Shield, Zap } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative floating blobs */}
      <div style={{
        position: "absolute", top: "-80px", left: "-80px",
        width: "400px", height: "400px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(240,171,252,0.35) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-100px", right: "-60px",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "10%",
        width: "250px", height: "250px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(196,181,253,0.3) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Main card */}
      <div
        className="glass-card-elevated"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Leaf style={{ color: "#6d28d9", width: 30, height: 30 }} strokeWidth={2.5} />
          <span
            className="font-display"
            style={{ fontSize: "32px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.03em" }}
          >
            Finbud
          </span>
        </div>

        <p style={{ fontSize: "14px", color: "#7c5cbf", marginBottom: "36px", textAlign: "center", lineHeight: 1.5 }}>
          Your AI-powered stock intelligence dashboard
        </p>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "36px", flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { icon: <TrendingUp size={12} />, label: "Live Signals" },
            { icon: <Zap size={12} />,        label: "AI Insights" },
            { icon: <Shield size={12} />,     label: "Smart Portfolio" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "6px 12px",
                background: "rgba(109,40,217,0.08)",
                border: "1px solid rgba(109,40,217,0.12)",
                borderRadius: "100px",
                fontSize: "11.5px", fontWeight: 500, color: "#4c1d95",
              }}
            >
              {icon} {label}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <button
            onClick={() => router.push("/auth/login")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
              color: "white",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(124,58,237,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(124,58,237,0.3)";
            }}
          >
            Log In
          </button>

          <button
            onClick={() => router.push("/auth/signup")}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "16px",
              border: "1.5px solid rgba(109,40,217,0.2)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(12px)",
              color: "#4c1d95",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              cursor: "pointer",
              transition: "transform 0.2s, border-color 0.2s, background 0.2s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.85)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.6)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.2)";
            }}
          >
            Create Account
          </button>
        </div>

        <p style={{ marginTop: "24px", fontSize: "12px", color: "#a78bfa", textAlign: "center" }}>
          By continuing you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}