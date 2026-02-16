/**
 * Market Service — placeholder for FastAPI backend integration.
 *
 * Currently returns mock data. When the backend is ready, replace
 * each function body with a fetch() call to your FastAPI endpoints.
 *
 * Example future endpoint: GET /api/v1/stocks/{symbol}/quote
 */

import { getStock, searchStocks, type StockData, type StockQuote } from "@/data/stocks";

// TODO: Replace with `fetch(`${API_BASE}/stocks/${symbol}`)` when backend is ready
export async function fetchStockData(symbol: string): Promise<StockData | null> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 400));
  return getStock(symbol) ?? null;
}

// TODO: Replace with `fetch(`${API_BASE}/stocks/search?q=${query}`)`
export async function fetchSearchResults(query: string): Promise<StockQuote[]> {
  await new Promise(r => setTimeout(r, 200));
  return searchStocks(query);
}
