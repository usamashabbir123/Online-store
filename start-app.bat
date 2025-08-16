@echo off
echo 🚀 Starting FashionHub Complete Application...
echo ==============================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install it first.
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are available

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "logs" mkdir logs
if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\logs" mkdir backend\logs

REM Copy environment files if they don't exist
if not exist "backend\.env" (
    echo 📝 Creating backend environment file...
    copy "backend\env.local" "backend\.env" >nul
)

if not exist "frontend\.env.local" (
    echo 📝 Creating frontend environment file...
    copy "frontend\env.local" "frontend\.env.local" >nul
)

REM Stop any existing containers
echo 🛑 Stopping any existing containers...
docker-compose down

REM Build and start all services
echo 🔨 Building and starting all services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...

REM Check PostgreSQL
docker exec fashionhub_postgres pg_isready -U fashionhub_user -d fashionhub_db >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL is ready
) else (
    echo ❌ PostgreSQL is not ready
)

REM Check Redis
docker exec fashionhub_redis redis-cli ping >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Redis is ready
) else (
    echo ❌ Redis is not ready
)

REM Check Backend
curl -f http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend API is ready
) else (
    echo ❌ Backend API is not ready
)

REM Check Frontend
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is ready
) else (
    echo ❌ Frontend is not ready
)

echo.
echo 🎉 FashionHub Application is starting up!
echo ==============================================
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo 📊 pgAdmin: http://localhost:5050
echo 🗄️  PostgreSQL: localhost:5432
echo 🔴 Redis: localhost:6379
echo.
echo 📋 Useful commands:
echo   View logs: docker-compose logs -f
echo   Stop app: docker-compose down
echo   Restart: docker-compose restart
echo   Rebuild: docker-compose up --build -d
echo.
echo ⏳ Services are starting up. Please wait a few minutes for everything to be ready.
echo 🔍 Check the logs with: docker-compose logs -f
echo.
pause
