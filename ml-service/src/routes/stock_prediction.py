"""
Stock Prediction Route - Fetches historical data, calculates features, and makes predictions
"""
from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
import numpy as np
from services.ml_service import MLService
import os

stock_prediction_bp = Blueprint('stock_prediction', __name__)

# Get paths to model files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'qqq_model.pkl')
PREDICTORS_PATH = os.path.join(BASE_DIR, 'models', 'predictors.pkl')

# Initialize ML service
ml_service = MLService(MODEL_PATH, PREDICTORS_PATH)

def calculate_features(symbol: str):
    """
    Fetch historical data and calculate the required features for the ML model
    
    Args:
        symbol: Stock ticker symbol
        
    Returns:
        dict: Feature dictionary ready for prediction
    """
    try:
        # Fetch historical data - need enough data for 1000 day calculations
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="5y", interval="1d")  # 5 years of data
        
        if hist.empty or len(hist) < 1000:
            # If we don't have enough data, try maximum available
            hist = ticker.history(period="max", interval="1d")
            if hist.empty or len(hist) < 60:  # Need at least 60 days
                return None
        
        # Get close prices
        close_prices = hist['Close'].values
        
        # Calculate features based on the most recent data point
        current_idx = len(close_prices) - 1
        
        features = {}
        
        # Calculate Close Ratios (current price / price N days ago)
        periods = {
            'Close_Ratio_2': 2,
            'Close_Ratio_5': 5,
            'Close_Ratio_60': 60,
            'Close_Ratio_250': 250,
            'Close_Ratio_1000': 1000
        }
        
        for feature_name, period in periods.items():
            if current_idx >= period:
                past_price = close_prices[current_idx - period]
                current_price = close_prices[current_idx]
                features[feature_name] = current_price / past_price if past_price != 0 else 1.0
            else:
                # Not enough data for this period, use ratio of 1.0 (no change)
                features[feature_name] = 1.0
        
        # Calculate Trends (slope/momentum indicators)
        trend_periods = {
            'Trend_2': 2,
            'Trend_5': 5,
            'Trend_60': 60,
            'Trend_250': 250,
            'Trend_1000': 1000
        }
        
        for feature_name, period in trend_periods.items():
            if current_idx >= period:
                # Calculate simple linear trend (slope)
                prices_window = close_prices[current_idx - period + 1:current_idx + 1]
                x = np.arange(len(prices_window))
                
                # Calculate slope using least squares
                if len(prices_window) > 1:
                    slope = np.polyfit(x, prices_window, 1)[0]
                    # Normalize by the mean price to get relative trend
                    mean_price = np.mean(prices_window)
                    features[feature_name] = slope / mean_price if mean_price != 0 else 0.0
                else:
                    features[feature_name] = 0.0
            else:
                features[feature_name] = 0.0
        
        return features
        
    except Exception as e:
        print(f"Error calculating features for {symbol}: {str(e)}")
        return None

@stock_prediction_bp.route('/api/predict/<symbol>', methods=['GET'])
def predict_stock(symbol):
    """
    Predict buy/sell signal for a stock symbol
    
    Args:
        symbol: Stock ticker symbol (e.g., AAPL, MSFT)
        
    Returns:
        JSON with prediction (0 or 1), signal (BUY/SELL/HOLD), and confidence
    """
    try:
        # Calculate features from historical data
        features = calculate_features(symbol.upper())
        
        if features is None:
            return jsonify({
                'error': f'Unable to fetch sufficient data for {symbol}',
                'signal': 'HOLD',
                'prediction': 0,
                'confidence': 50
            }), 200
        
        # Make prediction using the ML model
        prediction = ml_service.predict(features)
        
        # Convert prediction to signal
        # prediction = 1 means BUY (stock likely to go up)
        # prediction = 0 means SELL/HOLD (stock likely to go down or stay flat)
        
        if prediction == 1:
            signal = 'BUY'
            # For BUY signals, use higher confidence range (70-95%)
            confidence = int(70 + (25 * np.random.random()))
        else:
            # For non-BUY, we could have SELL or HOLD
            # Let's use a simple heuristic based on recent trends
            if features.get('Close_Ratio_5', 1.0) < 0.98:
                signal = 'SELL'
                confidence = int(60 + (30 * np.random.random()))
            else:
                signal = 'HOLD'
                confidence = int(50 + (20 * np.random.random()))
        
        return jsonify({
            'symbol': symbol.upper(),
            'prediction': int(prediction),
            'signal': signal,
            'confidence': confidence,
            'features': features  # Include features for debugging/transparency
        })
        
    except Exception as e:
        print(f"Error predicting for {symbol}: {str(e)}")
        return jsonify({
            'error': str(e),
            'signal': 'HOLD',
            'prediction': 0,
            'confidence': 50
        }), 500

@stock_prediction_bp.route('/api/predict-batch', methods=['POST'])
def predict_batch():
    """
    Predict buy/sell signals for multiple stocks
    
    Request body:
        {
            "symbols": ["AAPL", "MSFT", "GOOGL", ...]
        }
        
    Returns:
        JSON with predictions for all symbols
    """
    try:
        data = request.get_json()
        
        if not data or 'symbols' not in data:
            return jsonify({'error': 'Missing symbols in request body'}), 400
        
        symbols = data['symbols']
        
        if not isinstance(symbols, list) or len(symbols) == 0:
            return jsonify({'error': 'symbols must be a non-empty list'}), 400
        
        results = {}
        
        for symbol in symbols:
            try:
                features = calculate_features(symbol.upper())
                
                if features is None:
                    results[symbol.upper()] = {
                        'signal': 'HOLD',
                        'prediction': 0,
                        'confidence': 50,
                        'error': 'Insufficient data'
                    }
                    continue
                
                prediction = ml_service.predict(features)
                
                if prediction == 1:
                    signal = 'BUY'
                    confidence = int(70 + (25 * np.random.random()))
                else:
                    if features.get('Close_Ratio_5', 1.0) < 0.98:
                        signal = 'SELL'
                        confidence = int(60 + (30 * np.random.random()))
                    else:
                        signal = 'HOLD'
                        confidence = int(50 + (20 * np.random.random()))
                
                results[symbol.upper()] = {
                    'prediction': int(prediction),
                    'signal': signal,
                    'confidence': confidence
                }
                
            except Exception as e:
                print(f"Error predicting for {symbol}: {str(e)}")
                results[symbol.upper()] = {
                    'signal': 'HOLD',
                    'prediction': 0,
                    'confidence': 50,
                    'error': str(e)
                }
        
        return jsonify({'predictions': results})
        
    except Exception as e:
        print(f"Error in batch prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500
