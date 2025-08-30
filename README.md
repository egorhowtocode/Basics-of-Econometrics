# AI Technologies Search Demo

Flask frontend paired with a FastAPI processing service. The web app asks the processor for a list of AI technologies and renders them along with a Gartner-style maturity curve.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\\Scripts\\activate on Windows
pip install -r requirements.txt
pip install -r processing_app/requirements.txt
```

## Run (development)

Run the processing service and the Flask app (in separate terminals):

```bash
uvicorn processing_app.main:app --reload
flask --app app run --debug
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in a browser. Hover over technology cards to highlight their segment on the Gartner maturity curve.

## Docker Compose

Use Docker Compose to run the web and processing services together:

```bash
docker compose up --build
```

The web interface will be available at [http://localhost:8000](http://localhost:8000).

## Notes

Prototype — example data only.
