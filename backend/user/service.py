import json
from flask import jsonify, make_response, redirect, request, session
import requests
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from models import db
from functools import wraps
from google_auth_oauthlib.flow import Flow
from flask.wrappers import Response
from google.oauth2 import id_token
import uuid
import jwt
import datetime
import os
import pathlib

client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")
flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ],
    redirect_uri="http://127.0.0.1:5000/user/callback",
)
flow_login = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "openid",
    ],
    redirect_uri="http://127.0.0.1:5000/user/callback-login",
)
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = None
    if 'x-access-token' in request.headers:
      token = request.headers['x-access-token']

    if not token:
      return jsonify({'message': 'Token is missing'}), 401
    
    try:
      data = jwt.decode(token, os.environ['SECRET_KEY'], algorithms=['HS256'])
      current_user = User.query.filter_by(public_id = data['public_id']).first()
    except:
      return jsonify({'message': 'Token is invalid'}), 401
    
    return f(current_user, *args, **kwargs)
  
  return decorated


def login_service(data):
  user = User.query.filter_by(email=data['email']).first()    

  if not user:
    return jsonify({'message': 'User Does Not Exist'}), 401
  
  if check_password_hash(user.password, data['password']):
    token = jwt.encode({'public_id': user.public_id, 'exp' : datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=30)}, os.environ['SECRET_KEY'])

    return jsonify({'token': token.encode().decode('UTF-8'), 'public_id': user.public_id})
  
  return jsonify({'message': 'Incorrect Password'}), 401


def signup_service(data):
  hashed_password = generate_password_hash(data['password'], method='scrypt')

  new_user = User(public_id=str(uuid.uuid4()), name=data['name'], email=data['email'], password=hashed_password)
  db.session.add(new_user)
  db.session.commit()
  return jsonify({'message': 'New user created!', 'public_id': new_user.public_id})


def getuser_service(public_id):
  user = User.query.filter_by(public_id=public_id).first()

  if not user:
    return jsonify({'message': 'No User found'})
  
  user_data = {}
  user_data['public_id'] = user.public_id
  user_data['name'] = user.name
  user_data['email'] = user.email
  user_data['password'] = user.password

  return jsonify({'user': user_data})

def googlesignup_service():
  authorization_url, state = flow.authorization_url()
  # Store the state so the callback can verify the auth server response.
  session["state"] = state
  return Response(
      response=json.dumps({'auth_url':authorization_url}),
      status=200,
      mimetype='application/json'
  )

def googlelogin_service():
  authorization_url, state = flow_login.authorization_url()
  # Store the state so the callback can verify the auth server response.
  session["state"] = state
  return Response(
      response=json.dumps({'auth_url':authorization_url}),
      status=200,
      mimetype='application/json'
  )