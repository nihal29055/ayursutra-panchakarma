#!/bin/bash

# AyurSutra Setup Script
# This script sets up the development environment for AyurSutra

echo "🚀 Setting up AyurSutra Development Environment"
echo "================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment files if they don't exist
echo "📝 Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Created backend/.env from template"
else
    echo "ℹ️  backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/env.example frontend/.env
    echo "✅ Created frontend/.env from template"
else
    echo "ℹ️  frontend/.env already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Backend dependencies
if [ -f backend/package.json ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
    echo "✅ Backend dependencies installed"
else
    echo "❌ backend/package.json not found"
fi

# Frontend dependencies
if [ -f frontend/package.json ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    echo "✅ Frontend dependencies installed"
else
    echo "❌ frontend/package.json not found"
fi

# Build and start services with Docker Compose
echo "🐳 Starting services with Docker Compose..."

# Stop any existing containers
docker-compose down

# Build and start services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."

# Check MongoDB
if docker-compose ps mongodb | grep -q "Up"; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB failed to start"
fi

# Check Backend
if docker-compose ps backend | grep -q "Up"; then
    echo "✅ Backend API is running"
else
    echo "❌ Backend API failed to start"
fi

# Check Frontend
if docker-compose ps frontend | grep -q "Up"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
fi

# Seed the database
echo "🌱 Seeding database with sample data..."

# Wait for MongoDB to be ready
sleep 10

# Run seed scripts
echo "Creating admin user..."
docker-compose exec backend node scripts/create-admin.js

echo "Seeding therapies..."
docker-compose exec backend node scripts/seed-therapies.js

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   MongoDB: localhost:27017"
echo ""
echo "👤 Demo Credentials:"
echo "   Email: admin@ayursutra.com"
echo "   Password: admin123"
echo ""
echo "📚 Useful Commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Rebuild: docker-compose up --build"
echo ""
echo "🔧 Development:"
echo "   Backend dev: cd backend && npm run dev"
echo "   Frontend dev: cd frontend && npm start"
echo ""
echo "Happy coding! 🚀"
