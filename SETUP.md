# 🚀 FashionHub Complete Application Setup Guide

This guide will help you set up and run the complete FashionHub e-commerce application with both frontend and backend services.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Docker Desktop** (with Docker Compose)
- **Node.js** (v18 or higher) - for local development
- **Git** - for cloning the repository

## 🏗️ Architecture Overview

The application consists of the following services:

- **Frontend**: Next.js 14 application (Port 3000)
- **Backend**: Node.js/Express API (Port 5000)
- **Database**: PostgreSQL 15 (Port 5432)
- **Cache**: Redis 7 (Port 6379)
- **Database Admin**: pgAdmin (Port 5050)

## 🚀 Quick Start (Recommended)

### Option 1: Using Docker Compose (Easiest)

1. **Clone the repository** (if not already done):
   ```bash
   git clone <your-repo-url>
   cd Online-store
   ```

2. **Run the startup script**:

   **On Windows:**
   ```cmd
   start-app.bat
   ```

   **On macOS/Linux:**
   ```bash
   chmod +x start-app.sh
   ./start-app.sh
   ```

3. **Wait for services to start** (usually 2-3 minutes)

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - pgAdmin: http://localhost:5050

### Option 2: Manual Docker Compose

1. **Create environment files**:
   ```bash
   cp backend/env.local backend/.env
   cp frontend/env.local frontend/.env.local
   ```

2. **Start all services**:
   ```bash
   docker-compose up --build -d
   ```

3. **Check service status**:
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

## 🔧 Manual Setup (Advanced)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.local .env
   # Edit .env with your configuration
   ```

4. **Set up database**:
   ```bash
   # Start PostgreSQL and Redis
   docker-compose up -d postgres redis
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database
   npm run db:seed
   ```

5. **Start the backend**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.local .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the frontend**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## 🌐 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:5000 | REST API |
| API Health | http://localhost:5000/health | Health check |
| pgAdmin | http://localhost:5050 | Database management |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

## 🔐 Default Credentials

### Database
- **Host**: localhost
- **Port**: 5432
- **Database**: fashionhub_db
- **Username**: fashionhub_user
- **Password**: fashionhub_password

### pgAdmin
- **Email**: admin@fashionhub.com
- **Password**: admin_password

## 📊 Database Schema

The application uses Prisma ORM with the following main models:

- **Users**: Authentication and user management
- **Products**: Product catalog with categories
- **Orders**: Order management and tracking
- **Payments**: Payment processing and history
- **Cart**: Shopping cart functionality

## 🛠️ Development Commands

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm test             # Run tests
```

### Frontend Commands
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**:
   - Ensure ports 3000, 5000, 5432, 6379, and 5050 are available
   - Stop other services using these ports

2. **Database connection issues**:
   - Check if PostgreSQL container is running: `docker ps`
   - Check logs: `docker-compose logs postgres`

3. **Backend not starting**:
   - Check environment variables in `backend/.env`
   - Ensure database is running and accessible

4. **Frontend not loading**:
   - Check if backend API is accessible
   - Verify environment variables in `frontend/.env.local`

### Useful Docker Commands

```bash
# View all containers
docker ps

# View logs for a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Restart a specific service
docker-compose restart backend

# Rebuild and restart all services
docker-compose up --build -d

# Stop all services
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

## 📝 Environment Variables

### Backend (.env)
Key environment variables for the backend:

```env
DATABASE_URL=postgresql://fashionhub_user:fashionhub_password@localhost:5432/fashionhub_db
REDIS_URL=redis://:redis_password@localhost:6379
JWT_SECRET=your_jwt_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
Key environment variables for the frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🚀 Production Deployment

For production deployment:

1. **Update environment variables** with production values
2. **Set NODE_ENV=production**
3. **Use proper SSL certificates**
4. **Configure production database**
5. **Set up monitoring and logging**
6. **Configure CDN for static assets**

## 📚 API Documentation

The backend API includes the following endpoints:

- **Authentication**: `/api/auth/*`
- **Users**: `/api/users/*`
- **Products**: `/api/products/*`
- **Orders**: `/api/orders/*`
- **Payments**: `/api/payments/*`
- **Admin**: `/api/admin/*`

API documentation is available at: http://localhost:5000/api/docs (when implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs: `docker-compose logs -f`
3. Check GitHub issues
4. Create a new issue with detailed information

---

**Happy coding! 🎉**
