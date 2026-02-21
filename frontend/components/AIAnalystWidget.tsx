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

export default function AiAnalystWidget({ ticker, prediction, confidence, price }: AiWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: `Why ${ticker}? Strong earnings report anticipated, positive analyst sentiment, and new product launch rumors align with an ${confidence}% ${prediction} confidence.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const textToSend = input;
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, prediction, confidence, price, question: textToSend }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.explanation }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Having trouble connecting to the backend right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="glass-card w-full transition-all duration-300"
      style={{ padding: chatOpen ? "20px 24px" : "16px 24px" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: "18px" }}>🤖</span>
        <h2 className="font-display font-semibold" style={{ fontSize: "15px", color: "#1e0a3c", letterSpacing: "-0.01em" }}>
          AI Insights
        </h2>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{ maxHeight: chatOpen ? "110px" : "none", overflowY: chatOpen ? "auto" : "hidden" }}
        className="space-y-2"
      >
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <p
              style={{
                fontSize: "13.5px",
                lineHeight: "1.55",
                fontWeight: msg.role === "ai" ? 400 : 500,
                color: msg.role === "ai" ? "#3b1f6e" : "white",
                background: msg.role === "user" ? "linear-gradient(135deg,#7c3aed,#4c1d95)" : "none",
                padding: msg.role === "user" ? "8px 14px" : "0",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "0",
                maxWidth: "88%",
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1.5" style={{ color: "#7c3aed", fontSize: "12px" }}>
            <Loader2 size={12} className="animate-spin" /> Analyzing...
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleAskAi}
        className="relative mt-3"
        onFocus={() => setChatOpen(true)}
      >
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
            e.target.style.borderColor = "rgba(139,92,246,0.5)";
            e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.08)";
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
            color: "#7c3aed", opacity: input.trim() ? 1 : 0.35, transition: "opacity 0.2s",
            background: "none", border: "none", cursor: "pointer", padding: "4px",
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}