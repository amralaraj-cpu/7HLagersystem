#!/bin/bash

echo "╔════════════════════════════════════════════════════════╗"
echo "║   7HLager - Quick Setup & Test Script                 ║"
echo "║   Sjuhärads Biluthyrning & Transport AB                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Installing..."
    apt-get update && apt-get install -y postgresql postgresql-contrib
    service postgresql start
fi

# Start PostgreSQL if not running
if ! service postgresql status &> /dev/null; then
    echo "🔄 Starting PostgreSQL..."
    service postgresql start
fi

# Create database and user
echo "📊 Setting up database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS hlager;" 2>/dev/null
sudo -u postgres psql -c "CREATE DATABASE hlager;"
sudo -u postgres psql -c "CREATE USER hlager_user WITH PASSWORD 'hlager123';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hlager TO hlager_user;"
sudo -u postgres psql -c "ALTER DATABASE hlager OWNER TO hlager_user;"

echo "✅ Database created: hlager"

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

# Create .env file
cat > .env << EOF
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://hlager_user:hlager123@localhost:5432/hlager
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hlager
DB_USER=hlager_user
DB_PASSWORD=hlager123

JWT_SECRET=7hlager-super-secret-jwt-key-for-testing-2024
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=test@example.com
EMAIL_PASS=test-password
EMAIL_FROM=noreply@sjuharads.se

COMPANY_NAME=Sjuhärads Biluthyrning & Transport AB
COMPANY_ORG_NUMBER=556789-1234
COMPANY_ADDRESS=Borås, Sweden
COMPANY_PHONE=070-123 45 67
COMPANY_EMAIL=info@sjuharads.se
COMPANY_WEBSITE=www.sjuharads.se

FRONTEND_URL=http://localhost:3000
EOF

echo "✅ Backend .env created"

# Install backend dependencies
echo "📥 Installing backend dependencies (this may take a minute)..."
npm install --silent

# Run migrations and seeds
echo "🗄️  Creating database schema and warehouse locations..."
node database/migrate.js

echo "👥 Creating demo users..."
node database/seed.js

cd ..

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd frontend

# Create .env file
cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=7HLager
VITE_COMPANY_NAME=Sjuhärads Biluthyrning & Transport AB
EOF

echo "✅ Frontend .env created"

# Install frontend dependencies
echo "📥 Installing frontend dependencies (this may take a minute)..."
npm install --silent

cd ..

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ Setup Complete!                                   ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "🚀 To start the application, run:"
echo ""
echo "   Terminal 1 (Backend):"
echo "   cd backend && npm run dev"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   cd frontend && npm run dev"
echo ""
echo "🌐 Then open: http://localhost:3000"
echo ""
echo "🔐 Demo Login Credentials:"
echo "   Admin: admin@sjuharads.se / Admin123!"
echo "   User:  user@sjuharads.se / User123!"
echo ""
