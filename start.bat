@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║   🚀 Starting 7HLager Application                      ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Kill any existing processes on ports 5000 and 3000
echo 🔄 Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":5000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /F /PID %%a 2>nul

echo.
echo ▶️  Setting up database...
node backend\database\migrate.js
node backend\database\seed.js

echo.
echo ▶️  Starting backend server (port 5000)...
start "7HLager Backend" cmd /k "cd backend && node src\server.js"

echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo ▶️  Starting frontend server (port 3000)...
start "7HLager Frontend" cmd /k "cd frontend && npm run dev"

echo ⏳ Waiting for frontend to initialize...
timeout /t 10 /nobreak >nul

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   ✅ 7HLager is Running!                               ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🌐 Opening browser...
start http://localhost:3000
echo.
echo 🔐 Login with:
echo    Email: admin@sjuharads.se
echo    Password: Admin123!
echo.
echo ⛔ To stop: Close the two command windows that opened
echo.
pause
