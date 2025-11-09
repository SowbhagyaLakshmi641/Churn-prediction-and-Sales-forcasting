from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime

app = Flask(__name__)

# Load model and preprocessors
model = joblib.load('churn_model.pkl')
le = joblib.load('label_encoder.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    # Assuming data is a dict with customer features
    # Preprocess similar to training
    # This is a simplified example; adjust based on your actual features
    features = ['age', 'gender', 'country', 'days_since_signup', 'days_since_last_purchase',
                'cancellations_count', 'unit_price', 'quantity', 'purchase_frequency', 'category', 'Ratings']
    X = pd.DataFrame([data], columns=features)
    # Encode categoricals
    for col in ['gender', 'country', 'category']:
        X[col] = le.transform(X[col])
    # Scale numerics
    numeric_cols = ['age', 'days_since_signup', 'days_since_last_purchase', 'cancellations_count',
                    'unit_price', 'quantity', 'purchase_frequency', 'Ratings']
    X[numeric_cols] = scaler.transform(X[numeric_cols])
    prob = model.predict_proba(X)[0][1] * 100
    return jsonify({'churn_probability': prob})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
