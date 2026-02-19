/*
Uses the yfinance proxy that is running on the ml-service on port 5001
*/
import React from 'react'


interface Stock {
    ticker: string;
    open: number;
    close: number;
    volume: number;
    high: number;
    low: number;
}

const Stocks = async () => {
    // Fetch data for a single stock (QQQ as example)
    const ticker = 'QQQ';
    
    try {
        const res = await fetch(`http://localhost:5001/api/yahoo/${ticker}`, {
            cache: 'no-store'
        });
        
        if (!res.ok) {
            throw new Error(`Failed to fetch stock data: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Extract the latest data from the Yahoo Finance format response
        const result = data.chart?.result?.[0];
        if (!result) {
            throw new Error('No data available');
        }
        
        const meta = result.meta;
        const indicators = result.indicators?.quote?.[0];
        const latestIndex = indicators?.close?.length - 1;
        
        const stock: Stock = {
            ticker: ticker,
            open: indicators?.open?.[latestIndex] || 0,
            close: indicators?.close?.[latestIndex] || meta?.regularMarketPrice || 0,
            volume: indicators?.volume?.[latestIndex] || 0,
            high: indicators?.high?.[latestIndex] || 0,
            low: indicators?.low?.[latestIndex] || 0,
        };
        
        return (
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Stock Data</h2>
                <div className="border rounded-lg p-6 shadow-md bg-white max-w-md">
                    <h3 className="text-xl font-bold mb-4 text-blue-600">{stock.ticker}</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="font-semibold">Open:</span>
                            <span>${stock.open.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Close:</span>
                            <span>${stock.close.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">High:</span>
                            <span>${stock.high.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Low:</span>
                            <span>${stock.low.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Volume:</span>
                            <span>{stock.volume.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return (
            <div className="p-6">
                <p className="text-red-500">Error loading stock data. Make sure the ML service is running on port 5001.</p>
            </div>
        );
    }
}

export default Stocks