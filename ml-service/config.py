import os

class Config:
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    TESTING = os.getenv('TESTING', 'False') == 'True'
    MODEL_PATH = os.getenv('MODEL_PATH', 'src/models/qqq_model.pkl')
    PREDICTORS_PATH = os.getenv('PREDICTORS_PATH', 'src/models/predictors.pkl')
    API_VERSION = os.getenv('API_VERSION', 'v1')