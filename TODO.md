# Churn Prediction Model Integration TODO

## ML Service Development
- [x] Create ml-service/churn_model.py: Load data, EDA, feature engineering (churn label), preprocess, train Random Forest Classifier, evaluate, predict probabilities.
- [ ] Create ml-service/generate_churn_data.py: Use model to generate JSON data matching mockdata.js structure, save as ml-service/data/churn_predictions.json.

## Backend Integration
- [ ] Update backend/requirements.txt: Add pandas, scikit-learn, numpy, joblib.
- [ ] Create backend/routes/churn.py: New blueprint with /api/churn endpoint returning JSON from churn_predictions.json.
- [ ] Update backend/app.py: Register churn blueprint.

## Frontend Integration
- [x] Update frontend/src/components/ChurnPage.js: Fetch real data from /api/churn instead of mockdata.

## Testing and Deployment
- [ ] Install dependencies: pip install -r backend/requirements.txt
- [ ] Run generate_churn_data.py to create predictions JSON.
- [ ] Test backend endpoint with curl or browser.
- [ ] Run frontend dev server, verify ChurnPage shows real data.
- [ ] Evaluate model performance; retrain if needed.
