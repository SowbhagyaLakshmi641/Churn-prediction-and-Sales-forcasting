from app import mongo, bcrypt

class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def save(self):
        user_data = {
            'name': self.name,
            'email': self.email,
            'password': self.password
        }
        mongo.db.users.insert_one(user_data)

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email})

    @staticmethod
    def find_all():
        return list(mongo.db.users.find({}, {'password': 0}))
