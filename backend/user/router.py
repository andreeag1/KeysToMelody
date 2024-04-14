from flask import Blueprint, request
from user.service import signup_service;

user_blueprint = Blueprint("user", __name__)

@user_blueprint.route("/login")
def login():
  return "hello"

@user_blueprint.route("/signup", methods=['POST'])
def signup():
  data = request.get_json()
  return signup_service(data)