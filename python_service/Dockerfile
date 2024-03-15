# Use the official Python base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Install Poetry
# Only necessary if you need Poetry for runtime operations besides `poetry install`
RUN pip install poetry

RUN poetry install

# Copy the project files into the container
COPY . /app

# The CMD is not needed if you specify the start command in Railway's panel
# CMD ["poetry", "run", "flask", "run"]
