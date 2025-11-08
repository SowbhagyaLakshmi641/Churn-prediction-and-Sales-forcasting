from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import os
from routes.auth import auth_bp
from routes.churn import churn_bp
from routes.sales import sales_bp

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

# Initialize extensions
CORS(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(churn_bp, url_prefix='/api')
app.register_blueprint(sales_bp, url_prefix='/api')

@app.route('/')
def home():
    return jsonify({'message': 'Backend is running'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
