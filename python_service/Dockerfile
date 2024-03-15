# Use the official Python base image
FROM python:3.10.11

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy the Poetry configuration files into the container
COPY pyproject.toml poetry.lock* /app/

# Configure Poetry: Disable the creation of a virtual environment
# and install the dependencies directly
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of your application code into the container
COPY . /app

# Specify the command to run your app using Poetry to ensure
# it runs within the context that includes all dependencies
CMD ["poetry", "run", "flask", "run", "--host=0.0.0.0"]
