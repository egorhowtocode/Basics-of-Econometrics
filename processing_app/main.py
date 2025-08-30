from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

TARGET_QUESTION = (
    "Which AI technologies are used to enhance financial time series forecasting performance by processing multi-period inputs?"
)

TECHNOLOGIES = [
    {
        "id": "mlf",
        "name": "Multi-period Learning Framework (MLF)",
        "description": "Уточняет прогнозы спроса на разных горизонтах, что позволяет оптимизировать запасы и напрямую увеличивать объём продаж.",
        "instruments": ["Python", "R", "C++"],
        "sources": ["Zhang et al., 2024", "Lee & Kim, 2023"],
        "maturity": "Discovery",
        "segment": "discovery",
    },
    {
        "id": "irf",
        "name": "Inter-period Redundancy Filtering (IRF)",
        "description": "Удаляет лишние сигналы между периодами и помогает точнее выявлять ключевые факторы спроса, повышая эффективность ценовых стратегий.",
        "instruments": ["Python", "R", "C++"],
        "sources": ["Chen et al., 2022"],
        "maturity": "Technology Trigger",
        "segment": "trigger",
    },
    {
        "id": "lwi",
        "name": "Learnable Weighted-average Integration (LWI)",
        "description": "Комбинирует прогнозы разных горизонтов в сбалансированное решение, что улучшает планирование ассортимента и способствует росту продаж.",
        "instruments": ["Python", "R", "C++"],
        "sources": ["Garcia et al., 2023"],
        "maturity": "Peak of Inflated Expectations",
        "segment": "peak",
    },
    {
        "id": "fusion",
        "name": "Fusion",
        "description": "Объединяет сигналы из разнородных источников, создавая целостную картину рынка и повышая конверсию маркетинговых кампаний.",
        "instruments": ["Python", "R", "C++"],
        "sources": ["Patel & Singh, 2021"],
        "maturity": "Trough of Disillusionment",
        "segment": "trough",
    },
    {
        "id": "path-squeeze",
        "name": "Path Squeeze",
        "description": "Сокращает размерность временных путей и ускоряет аналитический цикл, позволяя быстрее выводить продукты на рынок и повышать продажи.",
        "instruments": ["Python", "R", "C++"],
        "sources": ["O'Neil et al., 2025"],
        "maturity": "Slope of Enlightenment",
        "segment": "slope",
    },
]


class Query(BaseModel):
    q: str


@app.post("/process")
async def process(query: Query):
    matched = query.q.strip().lower() == TARGET_QUESTION.strip().lower()
    items = TECHNOLOGIES if matched else []
    return {"matched": matched, "items": items}
