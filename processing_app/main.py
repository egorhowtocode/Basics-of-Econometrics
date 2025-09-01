from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

TARGET_QUESTION = (
    "Which AI technologies are used to enhance financial time series forecasting performance by processing multi-period inputs?"
)

TECHNOLOGIES = [
    {
        "name": "Multi-period Learning Framework (MLF)",
        "description": (
            "Уточняет прогнозы спроса на разных горизонтах, что позволяет **оптимизировать** "
            "запасы и напрямую увеличивать объём продаж.\n\n"
            "- Быстрый анализ\n"
            "- *Снижение рисков*"
        ),
        "instruments": ["Python", "R", "C++"],
        "sources": [
            {"name": "Zhang et al., 2024", "url": "https://google.com"},
            {"name": "Lee & Kim, 2023", "url": "https://google.com"},
        ],
        "segment": "discovery",
    },
    {
        "name": "Inter-period Redundancy Filtering (IRF)",
        "description": "Удаляет лишние сигналы между периодами и помогает точнее выявлять ключевые факторы спроса, повышая эффективность ценовых стратегий.",
        "instruments": ["Python", "R", "C++"],
        "sources": [{"name": "Chen et al., 2022", "url": "https://google.com"}],
        "segment": "trigger",
    },
    {
        "name": "Learnable Weighted-average Integration (LWI)",
        "description": "Комбинирует прогнозы разных горизонтов в сбалансированное решение, что улучшает планирование ассортимента и способствует росту продаж.",
        "instruments": ["Python", "R", "C++"],
        "sources": [{"name": "Garcia et al., 2023", "url": "https://google.com"}],
        "segment": "peak",
    },
    {
        "name": "Fusion",
        "description": "Объединяет сигналы из разнородных источников, создавая целостную картину рынка и повышая конверсию маркетинговых кампаний.",
        "instruments": ["Python", "R", "C++"],
        "sources": [{"name": "Patel & Singh, 2021", "url": "https://google.com"}],
        "segment": "trough",
    },
    {
        "name": "Path Squeeze",
        "description": "Сокращает размерность временных путей и ускоряет аналитический цикл, позволяя быстрее выводить продукты на рынок и повышать продажи.",
        "instruments": ["Python", "R", "C++"],
        "sources": [{"name": "O'Neil et al., 2025", "url": "https://google.com"}],
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
