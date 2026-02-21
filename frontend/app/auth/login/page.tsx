"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "14px",
    border: "1.5px solid rgba(167,139,250,0.25)",
    background: "rgba(237,228,255,0.45)",
    fontSize: "14px",
    color: "#1e0a3c",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#4c2888",
    marginBottom: "6px",
    display: "block",
    letterSpacing: "0.02em",
    textTransform: "uppercase" as const,
  };

  return (
    <div
      style={{
        height: "100vh", width: "100vw",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px", position: "relative", overflow: "hidden",
      }}
    >
      {/* Blobs */}
      <div style={{ position: "absolute", top: "-60px", right: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(240,171,252,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div className="glass-card-elevated" style={{ width: "100%", maxWidth: "400px", padding: "44px 36px", position: "relative", zIndex: 1 }}>
        
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <Leaf style={{ color: "#6d28d9", width: 22, height: 22 }} strokeWidth={2.5} />
          <span className="font-display" style={{ fontSize: "22px", fontWeight: 800, color: "#1e0a3c", letterSpacing: "-0.03em" }}>Finbud</span>
        </div>
        <h1 className="font-display" style={{ fontSize: "26px", fontWeight: 700, color: "#1e0a3c", marginBottom: "4px", letterSpacing: "-0.02em" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: "13.5px", color: "#7c5cbf", marginBottom: "32px" }}>Sign in to your account</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Email */}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.25)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: "44px" }}
                onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(167,139,250,0.25)"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#7c5cbf", padding: "2px" }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ textAlign: "right", marginTop: "6px" }}>
              <span style={{ fontSize: "12px", color: "#7c3aed", cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #7c3aed, #4c1d95)",
              color: "white", fontSize: "15px", fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
              transition: "transform 0.2s, box-shadow 0.2s",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(124,58,237,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(124,58,237,0.3)"; }}
          >
            Sign In
          </button>
        </div>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "13.5px", color: "#7c5cbf" }}>
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            style={{ color: "#6d28d9", fontWeight: 600, cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}