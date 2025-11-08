import pandas as pd
import json
from datetime import datetime
import numpy as np
from prophet import Prophet
import os
import requests

# Load the dataset
df = pd.read_csv('data/dataset.csv')

# Compute revenue
df['revenue'] = df['unit_price'] * df['quantity']

# salesByCategory: Top categories by total revenue
sales_by_category = df.groupby('category')['revenue'].sum().sort_values(ascending=False).reset_index()
sales_by_category['percentage'] = (sales_by_category['revenue'] / sales_by_category['revenue'].sum() * 100).round(2)
sales_by_category_json = sales_by_category.head(10).to_dict('records')  # Top 10

# revenueTrends: Monthly revenue trends from last_purchase_date
df['last_purchase_date'] = pd.to_datetime(df['last_purchase_date'])
df['month'] = df['last_purchase_date'].dt.to_period('M')
revenue_trends = df.groupby('month')['revenue'].sum().reset_index()
revenue_trends['month'] = revenue_trends['month'].astype(str)

# Forecast next 12 months using Prophet
hist = revenue_trends.copy()
hist['ds'] = pd.to_datetime(hist['month'])
hist['y'] = hist['revenue']
hist = hist[['ds', 'y']].sort_values('ds')

m = Prophet(changepoint_prior_scale=0.01, weekly_seasonality=False, yearly_seasonality=True)
m.fit(hist)

future = m.make_future_dataframe(periods=13, freq='M')
forecast = m.predict(future)

# Add predicted months
predicted = forecast[forecast['ds'] > pd.to_datetime('2025-12')][['ds', 'yhat']]
predicted['month'] = predicted['ds'].dt.to_period('M').astype(str)
predicted['revenue'] = predicted['yhat']
predicted['isPredicted'] = False
predicted = predicted[['month', 'revenue', 'isPredicted']]

# Append to revenue_trends
revenue_trends['isPredicted'] = False
revenue_trends = pd.concat([revenue_trends, predicted], ignore_index=True)
revenue_trends_json = revenue_trends.to_dict('records')

# ageDistribution: Age groups distribution (bins: 18-25, 26-35, 36-45, 46-60, 60+)
df['age_group'] = pd.cut(df['age'], bins=[0, 25, 35, 45, 60, 100], labels=['18-25', '26-35', '36-45', '46-60', '60+'])
age_dist = df['age_group'].value_counts().sort_index().reset_index()
age_dist.columns = ['age_group', 'count']
age_dist['percentage'] = (age_dist['count'] / len(df) * 100).round(2)
age_dist_json = age_dist.to_dict('records')

# customerSegments: Simple RFM-like segments based on purchase_frequency and total revenue per customer
customer_data = df.groupby('customer_id').agg({
    'purchase_frequency': 'max',
    'revenue': 'sum',
    'last_purchase_date': 'max'
}).reset_index()
customer_data['recency'] = (datetime.now() - customer_data['last_purchase_date']).dt.days
customer_data['segment'] = np.where(
    (customer_data['purchase_frequency'] > df['purchase_frequency'].median()) & 
    (customer_data['revenue'] > customer_data['revenue'].median()) & 
    (customer_data['recency'] < customer_data['recency'].median()), 'High Value',
    np.where(
        (customer_data['revenue'] > customer_data['revenue'].median()), 'Medium Value',
        'Low Value'
    )
)
segments = customer_data['segment'].value_counts().reset_index()
segments.columns = ['segment', 'count']
segments['percentage'] = (segments['count'] / len(customer_data) * 100).round(2)
segments_json = segments.to_dict('records')


# Top 10 products by total revenue
top_products = (
    df.groupby(['product_id', 'product_name', 'country'])['revenue']
    .sum()
    .reset_index()
    .sort_values('revenue', ascending=False)
    .head(10)
    .to_dict('records')
)

# Compile JSON
sales_data = {
    "salesByCategory": sales_by_category_json,
    "revenueTrends": revenue_trends_json,
    "ageDistribution": age_dist_json,
    "customerSegments": segments_json,
    "topProducts": top_products
}

# Forecast revenue per category using Prophet
# os.makedirs("inventory_forecasts", exist_ok=True)

# categories = df['category'].dropna().unique()

# forecasts = []

# for category in categories:
#     # Aggregate monthly revenue
#     hist = df[df['category']==category].groupby(
#         pd.Grouper(key='last_purchase_date', freq='M')
#     )['revenue'].sum().reset_index()
    
#     hist = hist.rename(columns={'last_purchase_date':'ds','revenue':'y'})
#     hist = hist.sort_values('ds')

#     if hist.empty:
#         print(f"No data for category: {category}, skipping.")
#         continue

#     # Fit Prophet with smoother trend
#     m = Prophet(changepoint_prior_scale=0.01, weekly_seasonality=False, yearly_seasonality=True)
#     m.fit(hist)

#     # Forecast next 12 months
#     future = m.make_future_dataframe(periods=12, freq='M')
#     forecast = m.predict(future)

#     # Merge historical + forecast
#     plot_df = forecast[['ds','yhat','yhat_lower','yhat_upper']].copy()
#     plot_df = plot_df.merge(hist, on='ds', how='left', suffixes=('','_hist'))

#     # Save as CSV per category
#     filename = f"inventory_forecasts/{category}_forecast.csv"
#     plot_df.to_csv(filename, index=False)
#     print(f"Saved forecast for {category} → {filename}")

#     # Add to forecasts list
#     plot_df['category'] = category
#     forecasts.append(plot_df.to_dict('records'))

sales_data['forecasts'] = []

# Post to backend
try:
    response = requests.post('http://localhost:5000/api/sales', json=sales_data)
    if response.status_code == 200:
        print("Sales data posted to backend successfully")
    else:
        print(f"Failed to post sales data: {response.status_code}")
except Exception as e:
    print(f"Error posting sales data: {e}")

# Also save to JSON as backup
with open('data/sales_data.json', 'w') as f:
    json.dump(sales_data, f, indent=2, default=str)

print("Sales data generated and saved to data/sales_data.json")
