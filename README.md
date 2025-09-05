# Product Analytics Q&A Demo

Flask frontend paired with a FastAPI processing service. The web app accepts natural language questions about product analytics and returns a curated set of technologies with their descriptions, recommended instrumentation approaches, relevant academic sources, and a Gartner-style maturity curve.

## Usage Scenarios

* **Choose an analytics stack** – Ask "What tools do I need for early-stage user tracking?" to receive technologies spanning event collection, storage, and visualization, along with their maturity.
* **Compare instrumentation approaches** – Ask "How do I collect cross-platform events?" to explore client versus server instruments and their tradeoffs.
* **Explore academic sources** – Ask "Which research informs retention strategies?" to see the scholarly foundations behind common metrics.
* **Map capabilities over time** – Ask "What should our analytics capability look like over the next 3 years?" to review the maturity curve and plan staged adoption.

## Technologies

| Technology | Description |
|------------|-------------|
| Mixpanel | User behavior analytics platform for funnels, cohorts, and retention analysis. |
| Amplitude | Product analytics tool focused on event segmentation, journey analysis, and experimentation. |
| Google Analytics | Web and app analytics with customizable dashboards and advertising integrations. |
| Segment | Customer data platform that routes events from sources to destinations. |
| dbt | Data transformation framework enabling modeled, version-controlled analytics. |
| Snowflake | Cloud data warehouse for scalable storage and query of analytics data. |

## Instruments

* Client and server event SDKs (JavaScript, iOS, Android, backend)
* Feature flagging for controlled rollouts
* A/B testing harnesses
* Session recording and heat mapping
* User feedback widgets

## Academic Sources

* Kohavi, R., Longbotham, R., Sommerfield, D., & Henne, R. (2009). "Controlled experiments on the web: survey of methods and results." *Data Mining and Knowledge Discovery*.
* Fader, P. S., & Hardie, B. G. (2013). "Customer-base analysis with discrete-time transaction data." *Marketing Science*.
* Anderson, E. W., Fornell, C., & Mazvancheryl, S. K. (2004). "Customer satisfaction and shareholder value." *Journal of Marketing*.
* McCarthy, J., & Fader, P. (2018). "The CLV Code: A systematic review of customer lifetime value models." *Journal of Interactive Marketing*.

## Gartner Maturity Curve

```
Innovation Trigger -> Peak of Inflated Expectations -> Trough of Disillusionment -> Slope of Enlightenment -> Plateau of Productivity
```

Each recommended technology is positioned along this curve in the UI, helping teams plan adoption based on maturity.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
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
