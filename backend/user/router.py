from flask import Blueprint, request, jsonify
from user.service import signup_service, login_service, token_required, getuser_service, googlesignup_service, googlelogin_service;
from flask_cors import CORS
import os
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
import google
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
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

user_blueprint = Blueprint("user", __name__)
CORS(user_blueprint)

@user_blueprint.route("/login", methods=["POST"])
def login():
  data = request.get_json()

  if not data:
    return jsonify({'message': 'Could Not Verify'}), 401
  
  return login_service(data)


@user_blueprint.route("/signup", methods=['POST'])
def signup():
  data = request.get_json()
  return signup_service(data)


@user_blueprint.route("/getuser/<public_id>", methods=['GET'])
@token_required
def getUser(current_user, public_id):
  public_id = public_id
  return getuser_service(public_id)


@user_blueprint.route("/google", methods=["GET"])
def googleSignup():
  return googlesignup_service()

@user_blueprint.route("/google-login", methods=["GET"])
def googleLogin():
  return googlelogin_service()


def Generate_JWT(payload):
    encoded_jwt = jwt.encode({'public_id': payload, 'exp' : datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=30)}, os.environ['SECRET_KEY'])
    return encoded_jwt


@user_blueprint.route("/callback", methods=["GET"])
def callbackSignup():
  flow.fetch_token(authorization_response=request.url)
  credentials = flow.credentials
  request_session = requests.session()
  token_request = google.auth.transport.requests.Request(session=request_session)

  id_info = id_token.verify_oauth2_token(
      id_token=credentials._id_token, request=token_request,
      audience=GOOGLE_CLIENT_ID
  )
  session["google_id"] = id_info.get("sub")
  
  # removing the specific audience, as it is throwing error
  del id_info['aud']
  jwt_token=Generate_JWT(id_info.get("sub"))

  user = User(public_id=id_info.get('sub'), name=id_info.get('name'), email=id_info.get('email'))
  db.session.add(user)
  db.session.commit()
  return redirect(f"http://localhost:5173/dashboard/{id_info.get('sub')}")

@user_blueprint.route("/callback-login", methods=["GET"])
def callbackLogin():
  flow_login.fetch_token(authorization_response=request.url)
  credentials = flow_login.credentials
  request_session = requests.session()
  token_request = google.auth.transport.requests.Request(session=request_session)

  id_info = id_token.verify_oauth2_token(
      id_token=credentials._id_token, request=token_request,
      audience=GOOGLE_CLIENT_ID
  )
  session["google_id"] = id_info.get("sub")
  
  # removing the specific audience, as it is throwing error
  del id_info['aud']
  jwt_token=Generate_JWT(id_info.get("sub"))

  return redirect(f"http://localhost:5173/dashboard/{id_info.get('sub')}")


