FROM python:3.10.11

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN pip install poetry waitress && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

COPY . /app

CMD ["python", "waitress_server.py"]
