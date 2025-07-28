#!/bin/bash

echo "🚀 Starting Detect CV Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping applications..."
    pkill -f "node.*server/index.js"
    pkill -f "react-scripts start"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "🔧 Starting backend server..."
cd server && node index.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend server is running on http://localhost:5001"
else
    echo "❌ Backend server failed to start"
    cleanup
fi

# Start frontend
echo "🌐 Starting frontend application..."
cd .. && npm start &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend application is running on http://localhost:3000"
else
    echo "❌ Frontend application failed to start"
    cleanup
fi

echo ""
echo "🎉 Detect CV Application is now running!"
echo ""
echo "📱 Access the application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop both applications"

# Wait for user to stop
wait 