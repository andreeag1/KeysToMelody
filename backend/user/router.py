from flask import Blueprint, request, make_response, jsonify
from user.service import signup_service, login_service, token_required, getuser_service, googlelogin_service;
from flask_cors import CORS

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
def getuser(current_user, public_id):
  public_id = public_id
  return getuser_service(public_id)

@user_blueprint.route("/user/google", methods=["GET"])
def googlelogin():
  return googlelogin_service()

@user_blueprint.route("/callback")
def callback():
  pass