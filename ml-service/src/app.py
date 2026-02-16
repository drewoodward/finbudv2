from flask import Flask
from routes.predictions import predictions_bp
import sys
import os

# Add parent directory to path so we can import config
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def create_app():
    app = Flask(__name__)
    
    # Load configuration
    try:
        from config import Config
        app.config.from_object(Config)
    except ImportError:
        # If config doesn't exist, use defaults
        app.config['DEBUG'] = True
    
    # Register blueprints
    app.register_blueprint(predictions_bp)
    
    return app

if __name__ == '__main__':
    app = create_app()
    print("🚀 Flask ML Service starting...")
    print("📊 Model loaded and ready for predictions")
    print("🌐 API available at http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
