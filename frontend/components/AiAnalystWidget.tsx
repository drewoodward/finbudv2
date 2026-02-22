"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface AiWidgetProps {
  ticker: string;
  prediction: string;
  confidence: number;
  price: number;
}

type Message = { role: "user" | "ai"; content: string };

const SAMPLE_PROMPTS = [
  "Why is this stock rated {signal}?",
  "What's driving the {conf}% confidence score?",
  "What are the risks for {ticker} right now?",
];

export default function AiAnalystWidget({ ticker, prediction, confidence, price }: AiWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset conversation when ticker changes
  useEffect(() => {
    setMessages([]);
    setInput("");
  }, [ticker]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, prediction, confidence, price, question: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.explanation }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Having trouble connecting to the backend right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Fill in the sample prompt placeholders with real values
  const formatPrompt = (prompt: string) =>
    prompt
      .replace("{ticker}", ticker)
      .replace("{signal}", prediction)
      .replace("{conf}", `${confidence}`);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="glass-card"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        gap: "12px",
        minHeight: "200px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "18px" }}>🤖</span>
        <h2
          className="font-display"
          style={{ fontSize: "15px", fontWeight: 700, color: "#1e0a3c", letterSpacing: "-0.01em" }}
        >
          AI Insights — {ticker}
        </h2>
      </div>

      {/* Empty state — show prompt suggestions */}
      {isEmpty && !loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <p style={{ fontSize: "13px", color: "#7c5cbf", marginBottom: "4px" }}>
            Ask me anything about {ticker}, or try a sample:
          </p>
          {SAMPLE_PROMPTS.map((prompt) => {
            const formatted = formatPrompt(prompt);
            return (
              <button
                key={prompt}
                onClick={() => sendMessage(formatted)}
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(109,40,217,0.15)",
                  background: "rgba(109,40,217,0.05)",
                  color: "#4c1d95",
                  fontSize: "12.5px",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(109,40,217,0.10)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(109,40,217,0.05)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(109,40,217,0.15)";
                }}
              >
                {formatted}
              </button>
            );
          })}
        </div>
      )}

      {/* Messages */}
      {!isEmpty && (
        <div
          ref={scrollRef}
          style={{ maxHeight: "180px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.55,
                  maxWidth: "90%",
                  color: msg.role === "ai" ? "#3b1f6e" : "white",
                  background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#4c1d95)" : "none",
                  padding: msg.role === "user" ? "8px 14px" : "0",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "0",
                }}
              >
                {msg.content}
              </p>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7c3aed", fontSize: "12px" }}>
              <Loader2 size={12} className="animate-spin" /> Analyzing {ticker}...
            </div>
          )}
        </div>
      )}

      {/* Loading spinner in empty state */}
      {isEmpty && loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7c3aed", fontSize: "12px" }}>
          <Loader2 size={12} className="animate-spin" /> Analyzing {ticker}...
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ position: "relative", marginTop: "auto" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask something about ${ticker}...`}
          disabled={loading}
          style={{
            width: "100%",
            background: "rgba(237,228,255,0.6)",
            border: "1px solid rgba(167,139,250,0.25)",
            borderRadius: "100px",
            padding: "10px 40px 10px 18px",
            fontSize: "13px",
            color: "#3b1f6e",
            outline: "none",
            fontFamily: "'DM Sans', sans-serif",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(124,58,237,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.08)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(167,139,250,0.25)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: input.trim() ? "pointer" : "default",
            color: "#7c3aed", opacity: input.trim() ? 1 : 0.35,
            transition: "opacity 0.2s", padding: "4px",
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}