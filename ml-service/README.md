# FinBud ML Service

This project is a microservice that exposes a machine learning model for making stock predictions. It is built using Flask and provides a simple API for accessing the model's predictions.

## Project Structure

```
finbud-ml-service
├── src
│   ├── app.py                # Entry point of the microservice
│   ├── routes                # Contains route definitions
│   │   ├── __init__.py
│   │   ├── predictions.py     # API endpoints for predictions
│   │   ├── yahoo_proxy.py     # Yahoo Finance proxy
│   │   └── stock_prediction.py # Stock prediction with auto feature calculation
│   ├── services              # Contains business logic
│   │   ├── __init__.py
│   │   └── ml_service.py      # Logic for loading the ML model and making predictions
│   ├── models                # Contains the ML model and predictors
│   │   ├── qqq_model.pkl
│   │   └── predictors.pkl
│   └── utils                 # Utility functions
│       ├── __init__.py
│       └── data_fetcher.py    # Functions for fetching and processing data
├── tests                     # Contains unit tests
│   ├── __init__.py
│   └── test_predictions.py     # Tests for prediction routes
├── requirements.txt          # Project dependencies
├── config.py                 # Configuration settings
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd finbud-insights/ml-service
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```bash
   python src/app.py
   ```

5. **Access the API:**
   The API will be available at `http://localhost:5001`

## API Endpoints

### 1. Stock Prediction (Recommended)
Get ML-powered buy/sell signals with automatic feature calculation from historical data.

**Single Stock:**
```bash
GET http://localhost:5001/api/predict/<symbol>
```

**Example:**
```bash
curl http://localhost:5001/api/predict/AAPL
```

**Response:**
```json
{
  "symbol": "AAPL",
  "prediction": 1,
  "signal": "BUY",
  "confidence": 85,
  "features": {
    "Close_Ratio_2": 1.02,
    "Trend_2": 0.015,
    "Close_Ratio_5": 1.05,
    "Trend_5": 0.012,
    "Close_Ratio_60": 1.15,
    "Trend_60": 0.008,
    "Close_Ratio_250": 1.25,
    "Trend_250": 0.005,
    "Close_Ratio_1000": 1.50,
    "Trend_1000": 0.003
  }
}
```

**Batch Prediction:**
```bash
POST http://localhost:5001/api/predict-batch
Content-Type: application/json

{
  "symbols": ["AAPL", "MSFT", "GOOGL", "NVDA"]
}
```

**Response:**
```json
{
  "predictions": {
    "AAPL": {
      "prediction": 1,
      "signal": "BUY",
      "confidence": 85
    },
    "MSFT": {
      "prediction": 1,
      "signal": "BUY",
      "confidence": 78
    },
    "GOOGL": {
      "prediction": 0,
      "signal": "HOLD",
      "confidence": 62
    },
    "NVDA": {
      "prediction": 1,
      "signal": "BUY",
      "confidence": 92
    }
  }
}
```

### 2. Raw Model Prediction (Advanced)
For advanced users who want to provide their own calculated features.

```bash
POST http://localhost:5001/predict
Content-Type: application/json

{
  "input_data": {
    "Close_Ratio_2": 1.02,
    "Trend_2": 0.015,
    "Close_Ratio_5": 1.05,
    "Trend_5": 0.012,
    "Close_Ratio_60": 1.15,
    "Trend_60": 0.008,
    "Close_Ratio_250": 1.25,
    "Trend_250": 0.005,
    "Close_Ratio_1000": 1.50,
    "Trend_1000": 0.003
  }
}
```

**Response:**
```json
{
  "prediction": 1
}
```

### 3. Yahoo Finance Proxy
```bash
GET http://localhost:5001/api/yahoo/<symbol>?range=1mo&interval=1d
```

## Signal Interpretation

- **prediction = 1, signal = "BUY"**: Stock likely to go up (confidence: 70-95%)
- **prediction = 0, signal = "HOLD"**: Stock trend unclear or neutral (confidence: 50-70%)
- **prediction = 0, signal = "SELL"**: Stock likely to go down (confidence: 60-90%)

## Feature Calculation

The ML model requires the following features:

1. **Close_Ratio_X**: Ratio of current price to price X days ago
   - Close_Ratio_2: 2-day momentum
   - Close_Ratio_5: 5-day momentum
   - Close_Ratio_60: 60-day momentum
   - Close_Ratio_250: 250-day momentum (1 year)
   - Close_Ratio_1000: 1000-day momentum (4 years)

2. **Trend_X**: Normalized slope of price over X days
   - Calculated using linear regression
   - Normalized by mean price for relative comparison

The `/api/predict/<symbol>` endpoint automatically calculates these features from historical data fetched via yfinance.

## Integration Example

### Frontend Integration (Next.js/React)

```typescript
// Fetch predictions for multiple stocks
const fetchPredictions = async () => {
  const symbols = ['AAPL', 'MSFT', 'GOOGL'];
  const response = await fetch('http://localhost:5001/api/predict-batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbols })
  });
  const data = await response.json();
  console.log(data.predictions);
};
```

### Python Integration

```python
import requests

# Single stock prediction
response = requests.get('http://localhost:5001/api/predict/AAPL')
prediction = response.json()
print(f"{prediction['symbol']}: {prediction['signal']} ({prediction['confidence']}%)")

# Batch prediction
response = requests.post(
    'http://localhost:5001/api/predict-batch',
    json={'symbols': ['AAPL', 'MSFT', 'GOOGL']}
)
predictions = response.json()['predictions']
```

## Dependencies

- Flask: Web framework
- Flask-CORS: Enable CORS for frontend access
- scikit-learn: ML model (RandomForest)
- yfinance: Fetch historical stock data
- pandas: Data manipulation
- numpy: Numerical calculations
- joblib: Model serialization

## Notes

- The model is trained on QQQ (Nasdaq 100 ETF) data
- Predictions work best for tech stocks with sufficient historical data
- Minimum 60 days of historical data required
- 1000+ days recommended for best accuracy
- Predictions are updated based on the most recent closing prices

## Troubleshooting

**Error: "Unable to fetch sufficient data"**
- Stock may be newly listed or delisted
- Check if the ticker symbol is correct
- Try stocks with longer trading history

**Error: "ML service returned 500"**
- Check if the ML service is running on port 5001
- Verify model files (qqq_model.pkl, predictors.pkl) exist in src/models/
- Check terminal for detailed error logs

## License

MIT License
