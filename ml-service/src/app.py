from flask import Flask
from flask_cors import CORS
#from routes.stock_prediction import predictions_bp
from routes.yahoo_proxy import yahoo_bp
from routes.stock_prediction import stock_prediction_bp
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for frontend
    CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "http://localhost:8081", "http://localhost:5173", "http://localhost:3000"]}})
    
    try:
        from config import Config
        app.config.from_object(Config)
    except ImportError:
        app.config['DEBUG'] = True
    
    # Register blueprints
    #app.register_blueprint(predictions_bp)
    app.register_blueprint(yahoo_bp)
    app.register_blueprint(stock_prediction_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Flask ML Service starting...")
    print("📊 Model loaded and ready for predictions")
    print("🌐 API available at http://localhost:5001")
    print("✅ CORS enabled + Yahoo Finance proxy")
    print("🎯 Stock prediction endpoints:")
    print("   - GET  /api/predict/<symbol>")
    print("   - POST /api/predict-batch")
    app.run(host='0.0.0.0', port=5001, debug=True)
