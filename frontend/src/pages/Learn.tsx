import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ArrowLeft, Target, Clock, Brain, ShieldCheck } from "lucide-react";

const concepts = [
  {
    icon: Target,
    title: "Confidence Score",
    shortDesc: "How sure the model is about its prediction.",
    longDesc: "The confidence score (like \"85% sure\") tells you how often the model's prediction was right when it saw similar patterns in the past. A higher score means the model found strong, repeating patterns. A lower score means there's more uncertainty — many things could change the outcome. It's never a guarantee, just a helpful guide.",
  },
  {
    icon: Clock,
    title: "Time Horizons",
    shortDesc: "Predictions over different timeframes.",
    longDesc: "We show forecasts for Tomorrow (1 day), Next Week (7 days), and Monthly (~30 days). Shorter predictions tend to be more accurate because fewer unexpected things can happen. Longer predictions show the bigger trend but come with more uncertainty. Always check the confidence score alongside the time horizon.",
  },
  {
    icon: Brain,
    title: "AI Analyst",
    shortDesc: "A plain-English explanation of what's happening.",
    longDesc: "Our AI Analyst reads recent news and market patterns, then explains what's moving a stock in simple language. Think of it as a knowledgeable friend who follows the markets and explains things without jargon. You can ask follow-up questions and it will always cite its sources.",
  },
  {
    icon: ShieldCheck,
    title: "Momentum (not \"Technical Indicators\")",
    shortDesc: "Whether a stock's price has been trending up or down recently.",
    longDesc: "When we say a stock has 'upward momentum,' it means the price has been generally rising over the past few days or weeks. It's like saying a ball rolling downhill — it tends to keep going in the same direction for a while. But momentum can change, which is why we pair it with confidence scores.",
  },
];

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-3 w-3" /> Back to dashboard
        </Link>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold mb-2">FinBud Basics</h1>
          <p className="text-muted-foreground text-sm">
            New to investing? No worries. Here's what the key terms in FinBud mean — explained simply.
          </p>
        </div>

        <div className="space-y-4">
          {concepts.map((c, i) => (
            <div key={i} className="glass-card p-5 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <c.icon className="h-4.5 w-4.5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-0.5">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{c.shortDesc}</p>
                  <p className="text-sm leading-relaxed text-foreground/80">{c.longDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground mt-12">
          FinBud is for educational purposes only. Always do your own research before investing.
        </p>
      </main>
    </div>
  );
};

export default Learn;
