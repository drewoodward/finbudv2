import requests
import json

# API endpoint
url = "http://localhost:5001/predict"

print("="*60)
print("Testing FinBud ML API - Stock Prediction Service")
print("="*60)

# Test Case 1: Bullish scenario (stock going up)
print("\n📈 Test 1: Bullish Pattern (positive trends)")
bullish_data = {
    "input": {
        'Close_Ratio_2': 1.02,      # 2% up over 2 days
        'Trend_2': 0.015,
        'Close_Ratio_5': 1.05,      # 5% up over 5 days
        'Trend_5': 0.012,
        'Close_Ratio_60': 1.15,     # 15% up over 60 days
        'Trend_60': 0.008,
        'Close_Ratio_250': 1.25,    # 25% up over 250 days
        'Trend_250': 0.005,
        'Close_Ratio_1000': 1.50,   # 50% up over 1000 days
        'Trend_1000': 0.003
    }
}

response = requests.post(url, json=bullish_data)
print(f"Status: {response.status_code}")
print(f"Prediction: {response.json()['prediction']}")
print(f"Interpretation: {'BUY (Stock likely to go up)' if response.json()['prediction'] == 1 else 'SELL/HOLD (Stock likely to go down)'}")

# Test Case 2: Bearish scenario (stock going down)
print("\n📉 Test 2: Bearish Pattern (negative trends)")
bearish_data = {
    "input": {
        'Close_Ratio_2': 0.98,      # 2% down over 2 days
        'Trend_2': -0.015,
        'Close_Ratio_5': 0.95,      # 5% down over 5 days
        'Trend_5': -0.012,
        'Close_Ratio_60': 0.85,     # 15% down over 60 days
        'Trend_60': -0.008,
        'Close_Ratio_250': 0.75,    # 25% down over 250 days
        'Trend_250': -0.005,
        'Close_Ratio_1000': 0.50,   # 50% down over 1000 days
        'Trend_1000': -0.003
    }
}

response = requests.post(url, json=bearish_data)
print(f"Status: {response.status_code}")
print(f"Prediction: {response.json()['prediction']}")
print(f"Interpretation: {'BUY (Stock likely to go up)' if response.json()['prediction'] == 1 else 'SELL/HOLD (Stock likely to go down)'}")

# Test Case 3: Mixed signals
print("\n📊 Test 3: Mixed Signals")
mixed_data = {
    "input": {
        'Close_Ratio_2': 1.01,
        'Trend_2': 0.005,
        'Close_Ratio_5': 0.99,
        'Trend_5': -0.002,
        'Close_Ratio_60': 1.05,
        'Trend_60': 0.003,
        'Close_Ratio_250': 0.95,
        'Trend_250': -0.001,
        'Close_Ratio_1000': 1.10,
        'Trend_1000': 0.001
    }
}

response = requests.post(url, json=mixed_data)
print(f"Status: {response.status_code}")
print(f"Prediction: {response.json()['prediction']}")
print(f"Interpretation: {'BUY (Stock likely to go up)' if response.json()['prediction'] == 1 else 'SELL/HOLD (Stock likely to go down)'}")

# Test Case 4: Error handling - missing field
print("\n❌ Test 4: Error Handling (missing required field)")
invalid_data = {
    "input": {
        'Close_Ratio_2': 1.01,
        'Trend_2': 0.005
        # Missing other required fields
    }
}

response = requests.post(url, json=invalid_data)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "="*60)
print("✅ All tests completed!")
print("="*60)
