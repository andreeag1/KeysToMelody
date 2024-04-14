from models import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  public_id = db.Column(db.String(50), unique=True)
  name = db.Column(db.String(50), nullable=False)
  email = db.Column(db.String(50), nullable=False)
  password = db.Column(db.String(256))