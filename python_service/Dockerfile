# Use an official Python runtime as a parent image
FROM python:3.9.3

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install poetry
RUN pip install poetry

# Install dependencies using poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Make port  available to the world outside this container
EXPOSE 80

# Define environment variable
ENV FLASK_APP=app.py

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0"]
