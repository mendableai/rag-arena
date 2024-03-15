FROM python:3.10.11

WORKDIR /app

RUN pip install poetry

RUN pip install gunicorn

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

COPY . /app

CMD ["poetry", "run", "gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "--timeout", "800", "--log-level", "debug", "app:app"]


