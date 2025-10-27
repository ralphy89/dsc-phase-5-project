#!/bin/bash

# Get port from environment or use default
PORT=${PORT:-8001}

echo "Starting ML Service on port $PORT"

# Start the application with uvicorn directly
uvicorn app:app --host 0.0.0.0 --port $PORT
