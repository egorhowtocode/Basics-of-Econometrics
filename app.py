from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

TECH_RESPONSES = {
    "Which AI technologies are used to enhance financial time series forecasting performance by processing multi-period inputs?": [
        {"name": "Multi-period Learning Framework (MLF)", "segment": "discovery"},
        {"name": "Inter-period Redundancy Filtering (IRF)", "segment": "tech-trigger"},
        {"name": "Learnable Weighted-average Integration (LWI)", "segment": "hype-peak"},
        {"name": "Fusion", "segment": "disillusionment"},
        {"name": "Path Squeeze", "segment": "enlightenment"},
    ]
}

INSTRUMENTS = ["Python", "R", "C++"]

@app.route("/")
def index():
    return render_template("index.html")

@app.post("/technologies")
def technologies():
    data = request.get_json(force=True)
    question = data.get("question", "")
    technologies = TECH_RESPONSES.get(question, [])
    for tech in technologies:
        tech["instruments"] = INSTRUMENTS
    return jsonify({"technologies": technologies})

if __name__ == "__main__":
    app.run(debug=True)
