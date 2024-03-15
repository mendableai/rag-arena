# Use the official Python base image
FROM python:3.10.11 as builder

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy only the files needed for poetry install
COPY pyproject.toml poetry.lock* /app/

# Disable the creation of a virtual environment and export dependencies to requirements.txt
# Note: The '--without-hashes' option is used for compatibility with pip
RUN poetry config virtualenvs.create false \
    && poetry export -f requirements.txt --output requirements.txt --without-hashes

# Start a new build stage
FROM python:3.10.11

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file from the builder stage
COPY --from=builder /app/requirements.txt /app/

# Install dependencies using requirements.txt
RUN pip install -r requirements.txt

# Copy the rest of your application code
COPY . /app

# The command to run your app (this is just a placeholder, since you use a custom start command)
CMD ["flask", "run", "--host=0.0.0.0"]
