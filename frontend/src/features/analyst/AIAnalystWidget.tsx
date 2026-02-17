import { useState } from "react";
import { MessageCircle, ChevronDown, Send, Bot, User, AlertTriangle } from "lucide-react";
import { askAnalyst, suggestedQuestions } from "@/services/llmService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { NewsItem } from "@/data/stocks";

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

interface AIAnalystWidgetProps {
  symbol: string;
  news: NewsItem[];
  explanation: string;
}

export function AIAnalystWidget({ symbol, news, explanation }: AIAnalystWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: explanation,
      sources: news.slice(0, 2).map(n => n.headline),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(question: string) {
    if (!question.trim()) return;
    const userMsg: Message = { role: "user", text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // TODO: Replace with real LLM call via llmService
    const response = await askAnalyst(symbol, question);
    setMessages(prev => [
      ...prev,
      { role: "assistant", text: response.answer, sources: response.sources },
    ]);
    setLoading(false);
  }

  return (
    <div className="glass-card flex flex-col animate-fade-in h-full">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium">AI Analyst</h3>
        <span className="text-xs text-muted-foreground ml-auto">Powered by FinBud AI</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[360px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2"
                : "space-y-2"
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="sources" className="border-border/30">
                      <AccordionTrigger className="text-xs text-muted-foreground py-1 hover:no-underline">
                        Sources ({msg.sources.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {msg.sources.map((s, j) => (
                            <li key={j} className="text-xs text-muted-foreground">• {s}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5 text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="h-3.5 w-3.5 text-primary animate-pulse-soft" />
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-soft" />
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.2s" }} />
              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-soft" style={{ animationDelay: "0.4s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border/50">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about this stock..."
            disabled={loading}
            className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-3 flex items-center gap-1.5">
        <AlertTriangle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
        <p className="text-[10px] text-muted-foreground">Educational only. Not financial advice.</p>
      </div>
    </div>
  );
}
