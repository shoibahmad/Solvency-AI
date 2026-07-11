#!/bin/bash
# Start FastAPI backend in the background
echo "Starting backend..."
cd /app/backend
uvicorn main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!

# Start Next.js frontend in the foreground
echo "Starting frontend..."
cd /app/frontend
node server.js &
FRONTEND_PID=$!

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?
