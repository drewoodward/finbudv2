from flask import Blueprint, request, jsonify
from services.ml_service import MLService
import os

predictions_bp = Blueprint('predictions', __name__)

# Get paths to model files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'qqq_model.pkl')
PREDICTORS_PATH = os.path.join(BASE_DIR, 'models', 'predictors.pkl')

# Initialize ML service
ml_service = MLService(MODEL_PATH, PREDICTORS_PATH)

@predictions_bp.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        if not data or 'input' not in data:
            return jsonify({'error': 'Invalid input data'}), 400
        
        input_data = data['input']
        prediction = ml_service.predict(input_data)
        
        return jsonify({'prediction': int(prediction)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
