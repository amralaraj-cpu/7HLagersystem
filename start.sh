#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║   🚀 Starting 7HLager Application                      ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if setup was done
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Setup not complete. Running setup first..."
    bash setup.sh
fi

# Start PostgreSQL if needed
service postgresql status &> /dev/null || service postgresql start

# Kill any existing processes on ports 5000 and 3000
echo "🔄 Cleaning up old processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo ""
echo "▶️  Starting backend server (port 5000)..."
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

echo "▶️  Starting frontend server (port 3000)..."
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 5

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ 7HLager is Running!                               ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000/api"
echo "💚 Health Check: http://localhost:5000/health"
echo ""
echo "🔐 Login with:"
echo "   Email: admin@sjuharads.se"
echo "   Password: Admin123!"
echo ""
echo "📋 Backend PID: $BACKEND_PID"
echo "📋 Frontend PID: $FRONTEND_PID"
echo ""
echo "📝 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "⛔ To stop: killall node"
echo ""
echo "Press Ctrl+C to view logs (servers will keep running)"

# Show combined logs
tail -f backend.log frontend.log
