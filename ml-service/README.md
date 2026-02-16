# FinBud ML Service

This project is a microservice that exposes a machine learning model for making stock predictions. It is built using Flask and provides a simple API for accessing the model's predictions.

## Project Structure

```
finbud-ml-service
├── src
│   ├── app.py                # Entry point of the microservice
│   ├── routes                # Contains route definitions
│   │   ├── __init__.py
│   │   └── predictions.py     # API endpoints for predictions
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
├── .env.example              # Example environment variables
├── .gitignore                # Files to ignore in Git
└── README.md                 # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd finbud-ml-service
   ```

2. **Create a virtual environment:**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Run the application:**
   ```
   python src/app.py
   ```

5. **Access the API:**
   The API will be available at `http://localhost:5000/predict` for making predictions.

## Usage Example

To make a prediction, send a POST request to the `/predict` endpoint with the required input data in JSON format.

```json
{
  "input_data": {
    "Close": 150.0,
    "Volume": 1000000,
    "Open": 149.0,
    "High": 151.0,
    "Low": 148.0
  }
}
```

