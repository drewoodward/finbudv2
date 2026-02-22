"""
Integration test script for the ML service
Tests the new stock prediction endpoints
"""
import requests
import json

BASE_URL = "http://localhost:5001"

def test_single_prediction():
    """Test single stock prediction"""
    print("\n" + "="*60)
    print("TEST 1: Single Stock Prediction (AAPL)")
    print("="*60)
    
    url = f"{BASE_URL}/api/predict/AAPL"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))
    
    data = response.json()
    if 'signal' in data:
        print(f"\n✅ Prediction: {data['signal']} with {data['confidence']}% confidence")
    
def test_batch_prediction():
    """Test batch prediction for multiple stocks"""
    print("\n" + "="*60)
    print("TEST 2: Batch Stock Prediction")
    print("="*60)
    
    url = f"{BASE_URL}/api/predict-batch"
    symbols = ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA"]
    
    print(f"Testing symbols: {', '.join(symbols)}")
    
    response = requests.post(url, json={"symbols": symbols})
    
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))
    
    data = response.json()
    if 'predictions' in data:
        print("\n📊 Summary:")
        for symbol, pred in data['predictions'].items():
            signal = pred.get('signal', 'N/A')
            conf = pred.get('confidence', 0)
            print(f"  {symbol}: {signal} ({conf}%)")

def test_yahoo_proxy():
    """Test Yahoo Finance proxy"""
    print("\n" + "="*60)
    print("TEST 3: Yahoo Finance Proxy (QQQ)")
    print("="*60)
    
    url = f"{BASE_URL}/api/yahoo/QQQ"
    response = requests.get(url)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        result = data.get('chart', {}).get('result', [{}])[0]
        meta = result.get('meta', {})
        
        print(f"\nSymbol: {meta.get('symbol', 'N/A')}")
        print(f"Current Price: ${meta.get('regularMarketPrice', 'N/A')}")
        print(f"Previous Close: ${meta.get('previousClose', 'N/A')}")
        print("✅ Yahoo proxy working")
    else:
        print(f"❌ Error: {response.text}")

if __name__ == "__main__":
    print("\n🧪 FinBud ML Service Integration Tests")
    print("="*60)
    
    try:
        # Test if service is running
        response = requests.get(BASE_URL)
        print("✅ ML Service is running")
    except requests.exceptions.ConnectionError:
        print("❌ ERROR: ML Service is not running!")
        print("   Please start it with: python ml-service/src/app.py")
        exit(1)
    
    # Run tests
    test_single_prediction()
    test_batch_prediction()
    test_yahoo_proxy()
    
    print("\n" + "="*60)
    print("✅ All tests completed!")
    print("="*60 + "\n")
