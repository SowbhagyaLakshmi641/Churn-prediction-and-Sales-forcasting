from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_bcrypt import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

# In-memory storage for users (temporary)
USERS = []
USER_ID_COUNTER = 1

@auth_bp.route('/register', methods=['POST'])
def register():
    from app import bcrypt
    global USER_ID_COUNTER, USERS
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        # Validation
        if not name or not email or not password:
            return jsonify({'message': 'All fields are required'}), 400

        # Check if user exists
        existing_user = next((u for u in USERS if u['email'] == email), None)
        if existing_user:
            return jsonify({'message': 'User already exists'}), 400

        # Hash password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Save user
        user_id = USER_ID_COUNTER
        USER_ID_COUNTER += 1
        user = {
            '_id': user_id,
            'name': name,
            'email': email,
            'password': hashed_password
        }
        USERS.append(user)

        # Generate token
        token = create_access_token(identity={'id': str(user_id), 'email': email})

        return jsonify({'message': 'User registered successfully', 'token': token}), 201
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    from app import bcrypt
    global USERS
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Validation
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Find user
        user = next((u for u in USERS if u['email'] == email), None)
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 400

        # Check password
        if not bcrypt.check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 400

        # Generate token
        token = create_access_token(identity={'id': str(user['_id']), 'email': user['email']})

        return jsonify({'message': 'Login successful', 'token': token})
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500

@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    global USERS
    try:
        users = [{'_id': str(u['_id']), 'name': u['name'], 'email': u['email']} for u in USERS]
        return jsonify({'users': users})
    except Exception as e:
        return jsonify({'message': 'Server error'}), 500
