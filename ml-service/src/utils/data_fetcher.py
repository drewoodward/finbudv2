import requests
import pandas as pd

def fetch_data_from_alpha_vantage(ticker):
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={ticker}&apikey=YOUR_API_KEY'
    response = requests.get(url)
    data = response.json()
    
    if "Time Series (Daily)" in data:
        return pd.DataFrame(data["Time Series (Daily)"]).transpose()
    else:
        raise ValueError("Error fetching data from Alpha Vantage: " + data.get("Note", "Unknown error"))