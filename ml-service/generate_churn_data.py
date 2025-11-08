import pandas as pd
import numpy as np
import json
import os
from datetime import datetime
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import warnings
warnings.filterwarnings('ignore')

# ---------- Utility: Robust datetime ----------
def robust_to_datetime(series):
    s = pd.to_datetime(series, errors='coerce', infer_datetime_format=True)
    if s.isna().sum() > 0:
        s2 = pd.to_datetime(series, errors='coerce', dayfirst=True, infer_datetime_format=True)
        if s2.isna().sum() < s.isna().sum():
            s = s2
    return s

# ---------- Load data ----------
df = pd.read_csv("data/dataset.csv")
df['signup_date'] = robust_to_datetime(df.get('signup_date', pd.Series()))
df['last_purchase_date'] = robust_to_datetime(df.get('last_purchase_date', pd.Series()))
current_date = df['last_purchase_date'].max()
df['inactive_days'] = (current_date - df['last_purchase_date']).dt.days
df['tenure_days'] = (current_date - df['signup_date']).dt.days
df['recency_days'] = df['inactive_days']

# ---------- Create churn_label if missing ----------
if 'churn_label' not in df.columns:
    df['churn_label'] = ((df['inactive_days']>180) | df['subscription_status'].isin(['cancelled','paused'])).astype(int)
else:
    if df['churn_label'].dtype != np.integer:
        le = LabelEncoder()
        df['churn_label'] = le.fit_transform(df['churn_label'].astype(str))

# ---------- Churn RF Model ----------
churn_features = ['age','tenure_days','recency_days','purchase_frequency','amount','cancellations_count','Ratings']
existing_features = [f for f in churn_features if f in df.columns]
X = df[existing_features].fillna(df[existing_features].median())
y = df['churn_label'].astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)
X_all_scaled = scaler.transform(X.fillna(X.median()))
df['churn_probability'] = rf_model.predict_proba(X_all_scaled)[:,1]*100

# ---------- Top 10 Customers ----------
top_customers = df.nlargest(10,'churn_probability')[['customer_id','country','churn_probability']]
top_customers['name'] = top_customers['customer_id'].astype(str)
top_customers = top_customers[['customer_id','name','country','churn_probability']].rename(columns={'customer_id':'id'})
top_customers['churn_probability'] = top_customers['churn_probability'].round(0).astype(int)
top_customers = top_customers[['id','name','country','churn_probability']].rename(columns={'churn_probability':'churnProbability'})
top_customers = top_customers.to_dict('records')

# ---------- Simple churn trend (without Prophet) ----------
churn_trend = df.groupby(pd.Grouper(key="last_purchase_date", freq="M"))['churn_label'].mean().reset_index()
churn_trend['churnRate'] = (churn_trend['churn_label']*100).round(0).fillna(0).astype(int)
churn_trend['month'] = churn_trend['last_purchase_date'].dt.strftime('%b')
month_order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
churn_trend['month'] = pd.Categorical(churn_trend['month'], categories=month_order, ordered=True)
churn_trends = churn_trend.sort_values('month')[['month','churnRate']]

# Ensure 'amount' column exists
if 'amount' not in df.columns:
    if 'unit_price' in df.columns and 'quantity' in df.columns:
        freq = df['purchase_frequency'] if 'purchase_frequency' in df.columns else 1
        df['amount'] = (
            pd.to_numeric(df['unit_price'], errors='coerce') *
            pd.to_numeric(df['quantity'], errors='coerce') *
            pd.to_numeric(freq, errors='coerce')
        )
    else:
        df['amount'] = 0

# ---------- K-Means Customer Segmentation ----------
numeric_features = ['age','tenure_days','recency_days','purchase_frequency','amount']
numeric_features = [f for f in numeric_features if f in df.columns]
X_seg = StandardScaler().fit_transform(df[numeric_features].fillna(df[numeric_features].median()))
best_score, best_k = -1, 3
for k in [2,3,4,5]:
    if k >= len(X_seg): continue
    labels = KMeans(n_clusters=k, random_state=42,n_init=10).fit_predict(X_seg)
    try: score = silhouette_score(X_seg, labels)
    except: score=-1
    if score>best_score: best_score=score; best_k=k
km = KMeans(n_clusters=best_k, random_state=42,n_init=10)
df['cluster'] = km.fit_predict(X_seg)

# Assign segment names
seg_stats = df.groupby('cluster')[numeric_features].mean()
overall = seg_stats.mean()
segment_names = {}
for cluster in seg_stats.index:
    stats = seg_stats.loc[cluster]
    if stats['amount']>overall['amount'] and stats['purchase_frequency']>overall['purchase_frequency']:
        segment_names[cluster] = "High-Value Frequent Buyers"
    elif stats['amount']>overall['amount']:
        segment_names[cluster] = "High-Value Occasional Buyers"
    elif stats['purchase_frequency']>overall['purchase_frequency']:
        segment_names[cluster] = "Frequent Low-Value Buyers"
    elif stats['recency_days']>overall['recency_days']:
        segment_names[cluster] = "At-Risk Customers"
    else:
        segment_names[cluster] = "Regular Customers"
df['segment'] = df['cluster'].map(segment_names)

# ---------- Segmentation summary ----------
segmentation = df['segment'].value_counts().reset_index()
segmentation.columns = ['name','value']
segmentation['color'] = segmentation['name'].map({
    'High-Value Frequent Buyers':'#FF6B6B',
    'High-Value Occasional Buyers':'#FFD93D',
    'Frequent Low-Value Buyers':'#6BCF7F',
    'At-Risk Customers':'#FFA500',
    'Regular Customers':'#6BCF7F'
})

# ---------- Country-level churn ----------
countries = df.groupby('country')['churn_probability'].mean().reset_index()
countries['churnRate'] = countries['churn_probability'].round(0).astype(int)
countries = countries[['country','churnRate']]

# ---------- Category-level churn ----------
categories = []
for cat in df['category'].dropna().unique():
    cat_df = df[df['category']==cat]
    country_data = cat_df.groupby('country')['churn_probability'].mean().reset_index()
    country_data['churnRate'] = country_data['churn_probability'].round(0).astype(int)
    categories.append({
        'name': cat,
        'countryData': country_data[['country','churnRate']].to_dict('records')
    })

# ---------- Build JSON ----------
churn_data = {
    'topCustomers': top_customers,
    'churnTrends': churn_trends.to_dict('records'),
    'segmentation': segmentation.to_dict('records'),
    'countries': countries.to_dict('records'),
    'categories': categories
}

# ---------- Save JSON ----------
os.makedirs('data', exist_ok=True)
with open('data/churn_predictions.json','w') as f:
    json.dump(churn_data, f, indent=2)

print("Churn predictions JSON saved to data/churn_predictions.json")