import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
from datetime import datetime

# Load data
df = pd.read_csv('data/dataset.csv')

# Basic EDA
print("Dataset shape:", df.shape)
print("Columns:", df.columns.tolist())
print("Data types:\n", df.dtypes)
print("Missing values:\n", df.isnull().sum())

# Handle dates
df['signup_date'] = pd.to_datetime(df['signup_date'])
df['last_purchase_date'] = pd.to_datetime(df['last_purchase_date'])
current_date = datetime.now()
df['days_since_last_purchase'] = (current_date - df['last_purchase_date']).dt.days
df['days_since_signup'] = (current_date - df['signup_date']).dt.days

# Feature engineering: Define churn
# Churn = 1 if days_since_last_purchase > 90 or cancellations_count > 2 or subscription_status != 'active'
df['churn'] = ((df['days_since_last_purchase'] > 90) |
               (df['cancellations_count'] > 2) |
               (df['subscription_status'] != 'active')).astype(int)

print("Churn distribution:", df['churn'].value_counts())

# Select features
features = ['age', 'gender', 'country', 'days_since_signup', 'days_since_last_purchase',
            'cancellations_count', 'unit_price', 'quantity', 'purchase_frequency', 'category', 'Ratings']
X = df[features]
y = df['churn']

# Preprocess
categorical_cols = ['gender', 'country', 'category']
le = LabelEncoder()
for col in categorical_cols:
    X[col] = le.fit_transform(X[col])

scaler = StandardScaler()
numeric_cols = ['age', 'days_since_signup', 'days_since_last_purchase', 'cancellations_count',
                'unit_price', 'quantity', 'purchase_frequency', 'Ratings']
X[numeric_cols] = scaler.fit_transform(X[numeric_cols])

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)[:, 1]
print("Accuracy:", accuracy_score(y_test, y_pred))
print("ROC-AUC:", roc_auc_score(y_test, y_pred_proba))

# Save model
joblib.dump(model, 'churn_model.pkl')
joblib.dump(le, 'label_encoder.pkl')
joblib.dump(scaler, 'scaler.pkl')

# Predict probabilities for all customers
df['churn_probability'] = model.predict_proba(X)[:, 1] * 100  # as percentage

# Save predictions
df[['customer_id', 'churn_probability']].to_csv('data/churn_probabilities.csv', index=False)

print("Model trained and saved. Predictions saved to data/churn_probabilities.csv")
