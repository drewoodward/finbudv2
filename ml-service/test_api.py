import requests
import json

# API endpoint
url = "http://localhost:5001/predict"

# First, let's check what predictors the model expects
# We'll need to load the predictors to see what features are needed
import joblib
predictors = joblib.load('src/models/predictors.pkl')

print("Model expects these features:")
print(predictors)
print(f"\nTotal features: {len(predictors)}")

# Create sample input data with all required features
# Using dummy values - you'd replace these with actual feature values
sample_input = {feature: 1.0 for feature in predictors}

# Make the API request
payload = {
    "input": sample_input
}

print("\n" + "="*50)
print("Testing API endpoint...")
print("="*50)

try:
    response = requests.post(url, json=payload)
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ API is working correctly!")
    else:
        print("\n❌ API returned an error")
        
except requests.exceptions.ConnectionError:
    print("\n❌ Could not connect to the API. Make sure the server is running on port 5001")
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
