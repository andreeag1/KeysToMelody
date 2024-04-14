from flask import jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from models import db
import uuid

def signup_service(data):
  hashed_password = generate_password_hash(data['password'], method='scrypt')

  new_user = User(public_id=str(uuid.uuid4()), name=data['name'], email=data['email'], password=hashed_password)
  db.session.add(new_user)
  db.session.commit()
  return jsonify({'message': 'New user created!'})