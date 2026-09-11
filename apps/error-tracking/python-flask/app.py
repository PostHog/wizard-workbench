from flask import Flask

app = Flask(__name__)


@app.route("/")
def index():
    return "hello"


@app.route("/boom")
def boom():
    raise RuntimeError("kaboom")


if __name__ == "__main__":
    app.run(port=8000)
