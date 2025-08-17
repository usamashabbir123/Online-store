#!/bin/sh

echo "🚀 Starting FashionHub Combined Application..."

# Start backend in background
echo "🔧 Starting backend service..."
./scripts/start-backend.sh &
BACKEND_PID=$!

# Wait a moment for backend to initialize
sleep 5

# Start frontend
echo "🎨 Starting frontend service..."
./scripts/start-frontend.sh &
FRONTEND_PID=$!

# Function to handle shutdown
cleanup() {
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Trap signals for graceful shutdown
trap cleanup SIGTERM SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
