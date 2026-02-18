"""
Yahoo Finance Proxy - Use yfinance library to avoid rate limits
"""
from flask import Blueprint, request, jsonify
import yfinance as yf

yahoo_bp = Blueprint('yahoo', __name__)

@yahoo_bp.route('/api/yahoo/<symbol>')
def get_stock_data(symbol):
    """Proxy Yahoo Finance using yfinance library"""
    try:
        ticker = yf.Ticker(symbol)
        
        # Get range from query params (default 1mo)
        range_param = request.args.get('range', '1mo')
        interval = request.args.get('interval', '1d')
        
        # Fetch history
        hist = ticker.history(period=range_param, interval=interval)
        
        if hist.empty:
            return jsonify({'error': f'No data for {symbol}'}), 404
        
        # Get current info
        info = ticker.info
        
        # Build response in Yahoo Finance API format
        closes = hist['Close'].tolist()
        opens = hist['Open'].tolist()
        highs = hist['High'].tolist()
        lows = hist['Low'].tolist()
        volumes = hist['Volume'].tolist()
        timestamps = [int(ts.timestamp()) for ts in hist.index]
        
        response = {
            'chart': {
                'result': [{
                    'meta': {
                        'symbol': symbol.upper(),
                        'regularMarketPrice': closes[-1],
                        'previousClose': info.get('previousClose', closes[-2] if len(closes) > 1 else closes[-1]),
                        'longName': info.get('longName', symbol),
                        'shortName': info.get('shortName', symbol),
                    },
                    'timestamp': timestamps,
                    'indicators': {
                        'quote': [{
                            'open': opens,
                            'high': highs,
                            'low': lows,
                            'close': closes,
                            'volume': volumes,
                        }]
                    }
                }]
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error fetching {symbol}: {str(e)}")
        return jsonify({'error': str(e)}), 500
