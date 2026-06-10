#!/bin/bash
echo "🚀 Starting TaskFlow (Python)..."
echo "▶ Seeding database..."
cd backend && python3 seed.py
echo "▶ Starting FastAPI backend on http://localhost:8000"
uvicorn main:app --reload --port 8000 &
BACK_PID=$!
sleep 2
echo "▶ Starting Angular frontend on http://localhost:4200"
cd ../frontend && npm start
trap "kill $BACK_PID 2>/dev/null" EXIT
