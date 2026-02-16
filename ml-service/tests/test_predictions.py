import pytest
from src.app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_prediction(client):
    response = client.post('/predict', json={
        "data": {
            "Close": 150.0,
            "Volume": 1000000,
            "Open": 149.0,
            "High": 151.0,
            "Low": 148.0
        }
    })
    assert response.status_code == 200
    assert 'Predictions' in response.get_json()