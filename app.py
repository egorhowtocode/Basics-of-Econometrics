from flask import Flask, jsonify, render_template, request
import requests

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/search")
def search():
    data = request.get_json(force=True) or {}
    query = data.get("q", "")
    try:
        resp = requests.post(
            "http://processor:8000/process", json={"q": query}, timeout=10
        )
        return jsonify(resp.json())
    except requests.RequestException:
        return jsonify({"matched": False, "items": []})


if __name__ == "__main__":
    app.run(debug=True)
