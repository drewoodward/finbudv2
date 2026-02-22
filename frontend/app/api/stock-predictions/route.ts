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

    // Call the ML service batch prediction endpoint
    const response = await fetch('http://localhost:5001/api/predict-batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbols }),
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const data = await response.json();

    // Also fetch current prices
    const priceData: { [key: string]: number } = {};
    await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const priceResponse = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0'
              }
            }
          );
          
          const priceJson = await priceResponse.json();
          
          if (priceJson.chart?.result?.[0]?.meta?.regularMarketPrice) {
            priceData[symbol] = priceJson.chart.result[0].meta.regularMarketPrice;
          } else {
            priceData[symbol] = 0;
          }
        } catch (err) {
          console.error(`Error fetching price for ${symbol}:`, err);
          priceData[symbol] = 0;
        }
      })
    );

    // Combine predictions and prices
    const results: any = {};
    for (const symbol of symbols) {
      const prediction = data.predictions?.[symbol.toUpperCase()];
      results[symbol] = {
        price: priceData[symbol],
        signal: prediction?.signal || 'HOLD',
        confidence: prediction?.confidence || 50,
        prediction: prediction?.prediction || 0,
      };
    }

    return NextResponse.json({ data: results });
  } catch (error) {
    console.error('Error in stock-predictions API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock predictions' },
      { status: 500 }
    );
  }
}
