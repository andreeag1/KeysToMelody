from flask import Blueprint

routes_blueprint = Blueprint("routes", __name__)

@routes_blueprint.route("/login")
def login():
  return "hello"