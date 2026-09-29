import os

from flask import Flask, jsonify

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("FLASK_SECRET_KEY", "dev")


@app.route("/")
def index():
    return jsonify(status="ok")


@app.route("/orders/<int:order_id>")
def order(order_id):
    if order_id == 0:
        raise ValueError("order 0 does not exist")
    return jsonify(id=order_id, status="shipped")


@app.route("/boom")
def boom():
    raise RuntimeError("kaboom")
