export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface Forecast {
  predictedPrice: number;
  direction: "up" | "down" | "flat";
  confidence: number; // 0-100
}

export interface StockForecasts {
  tomorrow: Forecast;
  nextWeek: Forecast;
  monthly: Forecast;
}

export interface NewsItem {
  headline: string;
  summary: string;
  source: string;
  timeAgo: string;
}

export interface StockData {
  quote: StockQuote;
  forecasts: StockForecasts;
  news: NewsItem[];
  sparkline: number[]; // simple price series for mini chart
}

export const stocksData: Record<string, StockData> = {
  AAPL: {
    quote: { symbol: "AAPL", name: "Apple Inc.", price: 189.84, change: 2.31, changePercent: 1.23 },
    forecasts: {
      tomorrow: { predictedPrice: 191.20, direction: "up", confidence: 82 },
      nextWeek: { predictedPrice: 194.50, direction: "up", confidence: 74 },
      monthly: { predictedPrice: 198.00, direction: "up", confidence: 61 },
    },
    news: [
      { headline: "Apple Vision Pro sales beat early estimates", summary: "Apple's new headset is seeing stronger demand than analysts expected, boosting investor confidence.", source: "TechCrunch", timeAgo: "2h ago" },
      { headline: "iPhone 16 production ramps up ahead of schedule", summary: "Supply chain reports suggest Apple is moving faster than usual to prepare for the fall launch.", source: "Bloomberg", timeAgo: "5h ago" },
      { headline: "Apple expands AI features across its ecosystem", summary: "New machine learning tools are being integrated into iOS, macOS, and watchOS.", source: "The Verge", timeAgo: "8h ago" },
      { headline: "Services revenue hits new quarterly record", summary: "App Store, Apple Music, and iCloud subscriptions continue to grow double digits.", source: "CNBC", timeAgo: "1d ago" },
    ],
    sparkline: [185, 186.5, 184, 187, 188.2, 186.8, 189, 188.5, 190, 189.84],
  },
  TSLA: {
    quote: { symbol: "TSLA", name: "Tesla, Inc.", price: 248.42, change: -5.18, changePercent: -2.04 },
    forecasts: {
      tomorrow: { predictedPrice: 245.00, direction: "down", confidence: 68 },
      nextWeek: { predictedPrice: 252.00, direction: "up", confidence: 55 },
      monthly: { predictedPrice: 260.00, direction: "up", confidence: 48 },
    },
    news: [
      { headline: "Tesla Cybertruck deliveries slower than expected", summary: "Production challenges continue to limit how many Cybertrucks reach customers each month.", source: "Reuters", timeAgo: "1h ago" },
      { headline: "EV competition heats up in China", summary: "BYD and other Chinese automakers are pressuring Tesla's market share in the world's largest EV market.", source: "WSJ", timeAgo: "4h ago" },
      { headline: "Tesla energy storage business surges", summary: "Megapack installations doubled year-over-year, becoming a bright spot for the company.", source: "Electrek", timeAgo: "6h ago" },
    ],
    sparkline: [255, 253, 256, 250, 248, 251, 247, 249, 246, 248.42],
  },
  SPY: {
    quote: { symbol: "SPY", name: "S&P 500 ETF", price: 502.12, change: 1.45, changePercent: 0.29 },
    forecasts: {
      tomorrow: { predictedPrice: 503.00, direction: "up", confidence: 71 },
      nextWeek: { predictedPrice: 505.50, direction: "up", confidence: 65 },
      monthly: { predictedPrice: 510.00, direction: "up", confidence: 58 },
    },
    news: [
      { headline: "Markets steady as Fed holds rates", summary: "The Federal Reserve kept interest rates unchanged, signaling patience on future cuts.", source: "AP", timeAgo: "3h ago" },
      { headline: "Tech stocks lead broad market gains", summary: "Large-cap technology companies drove the S&P 500 higher for the third straight session.", source: "MarketWatch", timeAgo: "5h ago" },
      { headline: "Jobs report comes in stronger than expected", summary: "The economy added more jobs than forecast, easing recession concerns.", source: "CNBC", timeAgo: "1d ago" },
    ],
    sparkline: [498, 499, 500.5, 499.8, 501, 500, 502, 501.5, 503, 502.12],
  },
  NVDA: {
    quote: { symbol: "NVDA", name: "NVIDIA Corporation", price: 875.28, change: 18.42, changePercent: 2.15 },
    forecasts: {
      tomorrow: { predictedPrice: 882.00, direction: "up", confidence: 78 },
      nextWeek: { predictedPrice: 900.00, direction: "up", confidence: 70 },
      monthly: { predictedPrice: 950.00, direction: "up", confidence: 62 },
    },
    news: [
      { headline: "NVIDIA unveils next-gen AI chips at GTC", summary: "The new Blackwell architecture promises 4x the AI training performance of current chips.", source: "NVIDIA Blog", timeAgo: "1h ago" },
      { headline: "Cloud providers increase GPU orders", summary: "Amazon, Google, and Microsoft are all expanding their NVIDIA GPU capacity for AI workloads.", source: "The Information", timeAgo: "3h ago" },
      { headline: "AI demand continues to outpace supply", summary: "Data center GPU shortages persist as every major tech company races to build AI infrastructure.", source: "FT", timeAgo: "7h ago" },
      { headline: "NVIDIA gaming revenue stabilizes", summary: "After a post-crypto dip, gaming GPU sales are returning to healthy growth patterns.", source: "PCWorld", timeAgo: "1d ago" },
      { headline: "Analysts raise price targets across the board", summary: "Multiple Wall Street firms have upgraded NVIDIA, citing unprecedented AI demand.", source: "Barron's", timeAgo: "1d ago" },
    ],
    sparkline: [840, 845, 850, 855, 860, 858, 865, 870, 878, 875.28],
  },
};

export const watchlistSymbols = ["AAPL", "TSLA", "SPY", "NVDA"];

export function getStock(symbol: string): StockData | undefined {
  return stocksData[symbol.toUpperCase()];
}

export function searchStocks(query: string): StockQuote[] {
  const q = query.toUpperCase();
  return Object.values(stocksData)
    .filter(s => s.quote.symbol.includes(q) || s.quote.name.toUpperCase().includes(q))
    .map(s => s.quote);
}
