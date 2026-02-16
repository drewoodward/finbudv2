from sklearn.ensemble import RandomForestClassifier
import joblib
import pandas as pd

class MLService:
    def __init__(self, model_path, predictors_path):
        self.model = self.load_model(model_path)
        self.predictors = self.load_predictors(predictors_path)

    def load_model(self, model_path):
        return joblib.load(model_path)

    def load_predictors(self, predictors_path):
        return joblib.load(predictors_path)

    def predict(self, input_data):
        input_df = pd.DataFrame(input_data, index=[0])
        predictions = self.model.predict(input_df[self.predictors])
        return predictions[0]