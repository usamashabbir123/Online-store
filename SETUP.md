# FashionHub E-commerce Platform - Setup Guide

This guide will help you set up and run the FashionHub e-commerce platform with its new organized structure.

## 🏗️ Project Structure

```
Online-store/
├── frontend/          # Next.js 15 + React 19 Frontend
│   ├── app/          # Next.js App Router
│   ├── components/   # React Components
│   ├── lib/          # Utility Libraries
│   ├── public/       # Static Assets
│   ├── styles/       # CSS Styles
│   ├── package.json  # Frontend Dependencies
│   └── Dockerfile    # Frontend Docker Image
├── backend/           # Node.js + Express.js Backend
│   ├── src/          # Source Code
│   ├── prisma/       # Database Schema
│   ├── package.json  # Backend Dependencies
│   ├── Dockerfile    # Backend Docker Image
│   └── docker-compose.yml # Backend Services
├── docs/             # Project Documentation
├── docker-compose.yml # Root Docker Compose (All Services)
├── package.json      # Root Package.json (Monorepo)
└── README.md         # Project Overview
```

## 🚀 Quick Start Options

### Option 1: Run Everything with Docker (Recommended)

```bash
# Start all services (frontend, backend, database, cache)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- pgAdmin: http://localhost:5050

### Option 2: Run Services Individually

#### Start Backend Services Only
```bash
cd backend
docker-compose up -d
```

#### Start Frontend Only
```bash
cd frontend
npm install
npm run dev
```

#### Start Backend Only
```bash
cd backend
npm install
npm run dev
```

### Option 3: Run Everything from Root (Monorepo)
```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend
npm run dev:backend
```

## 📋 Prerequisites

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **Docker**: 20.10.0 or higher
- **Docker Compose**: 2.0.0 or higher
- **PostgreSQL**: 15.0 or higher (if not using Docker)

## 🔧 Environment Configuration

### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
```

**Required Variables:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

### Backend Environment
```bash
cd backend
cp env.example .env
```

**Required Variables:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/fashionhub_db
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

## 🗄️ Database Setup

### Using Docker (Recommended)
```bash
cd backend
docker-compose up postgres -d
```

### Manual PostgreSQL Setup
```bash
# Create database
createdb fashionhub_db

# Run migrations
cd backend
npm run db:migrate

# Seed database
npm run db:seed
```

## 🔐 Security Configuration

### Generate Secure Secrets
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate session secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Update Environment Variables
```env
JWT_SECRET=generated_secret_here
JWT_REFRESH_SECRET=generated_refresh_secret_here
SESSION_SECRET=generated_session_secret_here
COOKIE_SECRET=generated_cookie_secret_here
```

## 🧪 Testing the Setup

### Test Backend API
```bash
# Health check
curl http://localhost:5000/health

# API documentation
curl http://localhost:5000/api/docs
```

### Test Frontend
```bash
# Open in browser
open http://localhost:3000
```

### Test Database Connection
```bash
# Using pgAdmin
open http://localhost:5050
# Login: admin@fashionhub.com / admin_password

# Using psql
psql -h localhost -U fashionhub_user -d fashionhub_db
```

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service_name]

# Restart service
docker-compose restart [service_name]

# Stop all services
docker-compose down
```

### Production
```bash
# Build and start
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

## 📊 Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Frontend logs
docker-compose logs -f frontend
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# Database health
docker-compose exec postgres pg_isready -U fashionhub_user
```

## 🔧 Development Workflow

### 1. Start Development Environment
```bash
# Start backend services
docker-compose up postgres redis -d

# Start backend in development mode
cd backend
npm run dev

# Start frontend in development mode
cd frontend
npm run dev
```

### 2. Make Changes
- Frontend changes auto-reload at http://localhost:3000
- Backend changes auto-reload at http://localhost:5000
- Database changes require migration: `npm run db:migrate`

### 3. Testing
```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run all tests from root
npm test
```

## 🚨 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 [PID]
```

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart service
docker-compose restart postgres
```

#### Frontend Build Issues
```bash
# Clear Next.js cache
cd frontend
rm -rf .next
npm run build
```

#### Backend Dependencies
```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Reset Everything
```bash
# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## 📚 Additional Resources

- **API Documentation**: See `docs/api-endpoints.md`
- **Backend Architecture**: See `docs/backend-architecture.md`
- **Database Schema**: See `docs/database-schema.md`
- **Security Documentation**: See `backend/security-documentation.md`
- **Backend README**: See `backend/README.md`

## 🆘 Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables are set correctly
3. Ensure all prerequisites are installed
4. Check the troubleshooting section above
5. Review the documentation in the `docs/` folder

---

**Happy coding! 🚀✨**
