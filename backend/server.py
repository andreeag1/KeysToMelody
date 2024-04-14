import os
from flask import Flask
from routes.routes import routes_blueprint
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ["SECRET_KEY"]

app.register_blueprint(routes_blueprint, url_prefix="/api")

if __name__ == "__main__":
  app.run(debug=True)