# Use the official Python base image
FROM python:3.10.11

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Install Gunicorn
RUN pip install gunicorn

# Copy the Poetry configuration files into the container
COPY pyproject.toml poetry.lock* /app/

# Configure Poetry: Disable the creation of a virtual environment
# and install the dependencies directly
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of your application code into the container
COPY . /app

# Specify the command to run your app using Gunicorn to ensure
# it runs within the context that includes all dependencies
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
