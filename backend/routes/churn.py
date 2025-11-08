from flask import Blueprint, jsonify, request
import json
import os

churn_bp = Blueprint('churn', __name__)

# In-memory storage for churn data
churn_data_store = None

@churn_bp.route('/churn', methods=['GET'])
def get_churn_data():
    if churn_data_store:
        return jsonify(churn_data_store)
    try:
        # Path to churn_predictions.json in ml-service
        json_path = os.path.join(os.path.dirname(__file__), '../../ml-service/data/churn_predictions.json')
        with open(json_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({'message': 'Churn data not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@churn_bp.route('/churn', methods=['POST'])
def update_churn_data():
    global churn_data_store
    data = request.get_json()
    churn_data_store = data
    return jsonify({'status': 'Churn data updated successfully'})
