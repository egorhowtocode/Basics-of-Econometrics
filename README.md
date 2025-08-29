# AI Technologies Search Demo

Minimal Flask web app demonstrating a question-driven search with a modern Tailwind UI.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\\Scripts\\activate on Windows
pip install -r requirements.txt
```

## Run (development)

```bash
flask --app app run --debug
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in a browser.

## Docker/Gunicorn

Build the image and run it with Gunicorn to serve the app on port 8000:

```bash
docker build -t ai-tech-search .
docker run --rm -p 8000:8000 ai-tech-search
```

The container binds to `0.0.0.0:8000`, making it reachable from outside the host machine (replace `localhost` with the host's IP).

## Notes

Prototype — example data only.
