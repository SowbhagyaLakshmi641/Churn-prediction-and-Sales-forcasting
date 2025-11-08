from flask import Blueprint, jsonify, request
import json
import os

sales_bp = Blueprint('sales', __name__)

# In-memory storage for sales data
sales_data_store = None

@sales_bp.route('/sales', methods=['GET'])
def get_sales_data():
    if sales_data_store:
        return jsonify(sales_data_store)
    try:
        # Path to the sales data file (adjust relative to backend)
        data_path = os.path.join(os.path.dirname(__file__), '../../ml-service/data/sales_data.json')
        with open(data_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'error': 'Sales data not found. Run generate_sales_data.py first.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@sales_bp.route('/sales', methods=['POST'])
def update_sales_data():
    global sales_data_store
    data = request.get_json()
    sales_data_store = data
    return jsonify({'status': 'Sales data updated successfully'})
