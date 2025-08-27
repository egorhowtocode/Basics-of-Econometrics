from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

TARGET_QUESTION = (
    "Which AI technologies are used to enhance financial time series forecasting performance by processing multi-period inputs?"
)

TECHNOLOGIES = [
    {
        "id": "mlf",
        "name": "Multi-period Learning Framework (MLF)",
        "summary": "Learns relationships across multiple temporal periods for financial forecasting.",
        "instruments": ["Python", "R", "C++"],
        "sources": [],
    },
    {
        "id": "irf",
        "name": "Inter-period Redundancy Filtering (IRF)",
        "summary": "Filters redundant signals between time periods.",
        "instruments": ["Python", "R", "C++"],
        "sources": [],
    },
    {
        "id": "lwi",
        "name": "Learnable Weighted-average Integration (LWI)",
        "summary": "Learns optimal weights to integrate forecasts from different periods.",
        "instruments": ["Python", "R", "C++"],
        "sources": [],
    },
    {
        "id": "fusion",
        "name": "Fusion",
        "summary": "Combines heterogeneous signals/features across horizons.",
        "instruments": ["Python", "R", "C++"],
        "sources": [],
    },
    {
        "id": "path-squeeze",
        "name": "Path Squeeze",
        "summary": "Reduces dimensionality along temporal paths.",
        "instruments": ["Python", "R", "C++"],
        "sources": [],
    },
]


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/search")
def search():
    data = request.get_json(force=True) or {}
    query = data.get("q", "")
    matched = query.strip().lower() == TARGET_QUESTION.strip().lower()
    items = TECHNOLOGIES if matched else []
    return jsonify({"matched": matched, "items": items})


if __name__ == "__main__":
    app.run(debug=True)
