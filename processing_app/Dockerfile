FROM python:3.11-slim
WORKDIR /app
COPY processing_app/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY processing_app/ .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
