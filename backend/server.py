import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from user.router import user_blueprint
from dotenv import load_dotenv
from models import db
from models.user import User
load_dotenv()

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ["SECRET_KEY"]
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DATABASE_URI"]

db.init_app(app)
with app.app_context():
  db.create_all()

app.register_blueprint(user_blueprint, url_prefix="/user")

if __name__ == "__main__":
  app.run(debug=True)