# Use the official Python base image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy the project files into the container
COPY . /app

# Use Poetry to install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

# Specify the command to run your app
CMD ["poetry", "run", "flask", "run"]
