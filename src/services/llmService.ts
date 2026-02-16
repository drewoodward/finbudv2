/**
 * LLM Service — placeholder for Gemini/GPT API integration.
 *
 * Currently returns canned mock responses. When ready, replace
 * with calls to your FastAPI endpoint that proxies to Gemini/GPT.
 *
 * Example future endpoint: POST /api/v1/analyst/chat
 */

import { getStock } from "@/data/stocks";

interface AnalystResponse {
  answer: string;
  sources: string[];
}

const cannedAnswers: Record<string, Record<string, AnalystResponse>> = {
  DEFAULT: {
    "Why is it up today?": {
      answer: "The stock is moving up mainly because of positive news about the company's recent announcements. When good news comes out, more people want to buy the stock, which pushes the price higher. Think of it like a popular item going on sale — everyone rushes to get it!",
      sources: ["Company press release", "Market analyst reports"],
    },
    "Is this risky?": {
      answer: "Every investment carries some risk. This stock has moderate price swings — meaning its price can move up or down by a few percent on any given day. For beginners, it's important to only invest money you won't need soon and to spread your investments across different stocks.",
      sources: ["Risk assessment model", "Historical price data"],
    },
    "What should I watch next week?": {
      answer: "Keep an eye on any upcoming earnings reports or product announcements. These events often cause bigger-than-usual price movements. Our model suggests the stock could move 2-3% in either direction next week based on current momentum.",
      sources: ["Earnings calendar", "Momentum analysis"],
    },
  },
};

// TODO: Replace with POST to your FastAPI /analyst/chat endpoint
export async function askAnalyst(symbol: string, question: string): Promise<AnalystResponse> {
  await new Promise(r => setTimeout(r, 800));

  const stock = getStock(symbol);
  const answers = cannedAnswers.DEFAULT;
  
  if (answers[question]) {
    return answers[question];
  }

  // Generic fallback for free-text questions
  return {
    answer: `That's a great question about ${stock?.quote.name ?? symbol}! Based on recent patterns, the stock is showing ${stock?.forecasts.tomorrow.direction === "up" ? "positive" : "mixed"} momentum. Remember, our predictions are based on historical patterns and current news — they're educational tools, not guarantees.`,
    sources: ["Pattern analysis", "News sentiment"],
  };
}

export const suggestedQuestions = [
  "Why is it up today?",
  "Is this risky?",
  "What should I watch next week?",
];
