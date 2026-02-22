from flask import Blueprint

# Create a blueprint for the routes
routes_bp = Blueprint('routes', __name__)

# Import the stock_prediction module to register its routes
from . import stock_prediction