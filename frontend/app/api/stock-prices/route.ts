import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbols = searchParams.get('symbols')?.split(',') || [];

    if (symbols.length === 0) {
      return NextResponse.json(
        { error: 'No symbols provided' },
        { status: 400 }
      );
    }

    const priceData: { [key: string]: number } = {};

    // Fetch prices for each symbol using Yahoo Finance API
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0'
              }
            }
          );
          
          const data = await response.json();
          
          if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
            priceData[symbol] = data.chart.result[0].meta.regularMarketPrice;
          } else {
            priceData[symbol] = 0;
          }
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err);
          priceData[symbol] = 0;
        }
      })
    );

    return NextResponse.json({ prices: priceData });
  } catch (error) {
    console.error('Error in stock-prices API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock prices' },
      { status: 500 }
    );
  }
}
