@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║   🔧 7HLager Setup Script for Windows                  ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo 📦 Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org
    echo Download the LTS version and restart your computer after installation.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
npm --version
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║   ✅ Setup Complete!                                   ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo 🚀 To start the application, double-click: start.bat
echo.
pause
