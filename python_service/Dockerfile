FROM python:3.10.11

WORKDIR /app

RUN pip install poetry

RUN pip install gunicorn

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

COPY . /app
