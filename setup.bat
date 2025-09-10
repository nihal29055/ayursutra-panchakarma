@echo off
echo 🚀 Setting up AyurSutra Development Environment
echo ================================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create environment files if they don't exist
echo 📝 Setting up environment files...

if not exist "backend\.env" (
    copy "backend\env.example" "backend\.env" >nul
    echo ✅ Created backend\.env from template
) else (
    echo ℹ️  backend\.env already exists
)

if not exist "frontend\.env" (
    copy "frontend\env.example" "frontend\.env" >nul
    echo ✅ Created frontend\.env from template
) else (
    echo ℹ️  frontend\.env already exists
)

REM Install dependencies
echo 📦 Installing dependencies...

REM Backend dependencies
if exist "backend\package.json" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
) else (
    echo ❌ backend\package.json not found
)

REM Frontend dependencies
if exist "frontend\package.json" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ frontend\package.json not found
)

REM Build and start services with Docker Compose
echo 🐳 Starting services with Docker Compose...

REM Stop any existing containers
docker-compose down

REM Build and start services
docker-compose up --build -d

echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...

REM Check MongoDB
docker-compose ps mongodb | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running
) else (
    echo ❌ MongoDB failed to start
)

REM Check Backend
docker-compose ps backend | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Backend API is running
) else (
    echo ❌ Backend API failed to start
)

REM Check Frontend
docker-compose ps frontend | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Frontend is running
) else (
    echo ❌ Frontend failed to start
)

REM Seed the database
echo 🌱 Seeding database with sample data...

REM Wait for MongoDB to be ready
timeout /t 10 /nobreak >nul

REM Run seed scripts
echo Creating admin user...
docker-compose exec backend node scripts/create-admin.js

echo Seeding therapies...
docker-compose exec backend node scripts/seed-therapies.js

echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    MongoDB: localhost:27017
echo.
echo 👤 Demo Credentials:
echo    Email: admin@ayursutra.com
echo    Password: admin123
echo.
echo 📚 Useful Commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    Rebuild: docker-compose up --build
echo.
echo 🔧 Development:
echo    Backend dev: cd backend ^&^& npm run dev
echo    Frontend dev: cd frontend ^&^& npm start
echo.
echo Happy coding! 🚀
pause
