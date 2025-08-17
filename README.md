# FashionHub - Modern E-commerce Platform

A complete, professional e-commerce platform built with Next.js, Node.js, and PostgreSQL. Features a single Docker image architecture with comprehensive configuration management for production deployment.

## 🚀 **Features**

- **🛍️ Full E-commerce Functionality** - Products, cart, checkout, payments
- **👤 User Management** - Authentication, profiles, orders
- **🎨 Modern UI/UX** - Next.js 14 with Tailwind CSS and Shadcn/ui
- **🔒 Enterprise Security** - JWT, rate limiting, input validation
- **💳 Payment Integration** - Stripe and PayPal support
- **📊 Admin Dashboard** - Complete management interface
- **🐳 Single Image Deployment** - Combined frontend and backend
- **⚙️ Production Configuration** - JSON-based with environment variables
- **🔧 Professional CI/CD** - GitLab CI with automated builds

## 🏗️ **Architecture**

### **Single Image Approach**
- **One Docker image** containing both frontend and backend
- **Simplified deployment** and management
- **Production-ready** with external database support
- **JSON configuration** system for different environments

### **Technology Stack**
- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js 18, Express.js, Prisma ORM
- **Database**: PostgreSQL (external on VM)
- **Cache**: Redis (external on VM)
- **Payments**: Stripe, PayPal
- **Deployment**: Docker, Kubernetes, GitLab CI/CD

## 📋 **Prerequisites**

- **Node.js 18+** and npm
- **Docker** and Docker Compose
- **GitLab** account with Container Registry
- **Kubernetes** cluster (optional)
- **PostgreSQL** running on VM
- **Redis** running on VM

## 🚀 **Quick Start**

### **1. Clone and Setup**

```bash
git clone <your-repo-url>
cd Online-store
```

### **2. Local Development Configuration**

```bash
# Edit local configuration
nano config/config.json

# Update database and Redis settings for local development
```

### **3. Database Setup**

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE fashionhub_db;
CREATE USER fashionhub_user WITH PASSWORD 'your_local_password';
GRANT ALL PRIVILEGES ON DATABASE fashionhub_db TO fashionhub_user;
\q

# Run migrations
cd backend
npm run db:migrate
npm run db:seed
```

### **4. Local Development**

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## 🐳 **Docker Deployment**

### **Build and Run**

```bash
# Build the combined image
docker build -t fashionhub:latest .

# Run with environment variables
docker run -d \
  --name fashionhub \
  -p 3000:3000 \
  -p 5000:5000 \
  --env-file .env \
  fashionhub:latest
```

### **Docker Compose**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## ☸️ **Kubernetes Deployment**

### **1. Create Secrets**

```bash
# Create Kubernetes secrets
kubectl create secret generic fashionhub-secrets \
  --from-literal=postgres-password=your_password \
  --from-literal=redis-password=your_password \
  --from-literal=jwt-secret=your_jwt_secret \
  -n fashionhub
```

### **2. Deploy Application**

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/fashionhub-deployment.yaml -n fashionhub
kubectl apply -f k8s/services.yaml -n fashionhub
kubectl apply -f k8s/ingress.yaml -n fashionhub
```

### **3. Update Application**

```bash
# Update to new version
kubectl set image deployment/fashionhub-app \
  fashionhub=registry.gitlab.com/username/project/fashionhub:v1.0.0 \
  -n fashionhub
```

## 🔄 **CI/CD Pipeline**

### **GitLab CI Setup**

1. **Configure Variables** in GitLab CI/CD Settings:
   - `CI_REGISTRY_USER`
   - `CI_REGISTRY_PASSWORD`
   - `CI_REGISTRY`
   - `CI_REGISTRY_IMAGE`

2. **Create Tags** for releases:
   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

3. **Pipeline Stages**:
   - **Validate** - Code quality and dependencies
   - **Test** - Unit and integration tests
   - **Build** - Single Docker image
   - **Tag** - Push to registry

## ⚙️ **Configuration Management**

### **Configuration Files**

- **`config/config.json`** - Local development configuration
- **`config/config.json.template`** - Production template with environment variables
- **`env.example`** - Environment variables template

### **Environment-Based Configuration**

The application automatically loads the appropriate configuration based on `NODE_ENV`:

- **Development** (`NODE_ENV=development`): Uses `config/config.json`
- **Production** (`NODE_ENV=production`): Uses `config/config.json.template` with environment variable substitution

### **Key Configuration Sections**

```json
{
  "app": {
    "name": "FashionHub",
    "environment": "production",
    "port": 5000
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "fashionhub_db",
    "password": "${POSTGRES_PASSWORD}"
  },
  "redis": {
    "host": "localhost",
    "port": 6379,
    "password": "${REDIS_PASSWORD}"
  }
}
```

## 🔧 **Development**

### **Project Structure**

```
Online-store/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Configuration management
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Express middleware
│   │   └── scripts/        # Database scripts
│   └── prisma/             # Database schema
├── frontend/               # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   └── lib/               # Utilities
├── config/                # Configuration files
│   ├── config.json        # Local development
│   └── config.json.template # Production template
├── scripts/               # Startup scripts
├── k8s/                   # Kubernetes manifests
└── docs/                  # Documentation
```

### **Available Scripts**

```bash
# Backend
npm run dev              # Development server
npm run test             # Run tests
npm run db:migrate       # Database migrations
npm run db:seed          # Seed database

# Frontend
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server

# Docker
docker build -t fashionhub .  # Build image
docker run fashionhub         # Run container
```

## 🔒 **Security Features**

- **JWT Authentication** with refresh tokens
- **Rate Limiting** on API endpoints
- **Input Validation** with express-validator
- **CORS Protection** with configurable origins
- **Helmet Security** headers
- **XSS Protection** with xss-clean
- **SQL Injection Protection** with Prisma ORM
- **File Upload Security** with type validation

## 📊 **Monitoring & Logging**

- **Winston Logging** with file rotation
- **Health Check Endpoint** at `/health`
- **Request Logging** with IP and User-Agent
- **Error Tracking** with stack traces
- **Performance Monitoring** ready for Prometheus

## 🗄️ **Database Schema**

### **Core Tables**
- **Users** - Authentication and profiles
- **Products** - Product catalog
- **Categories** - Product categories
- **Orders** - Customer orders
- **OrderItems** - Order line items
- **Addresses** - Shipping/billing addresses
- **Payments** - Payment records

### **Database Setup**

```sql
-- Create database
CREATE DATABASE fashionhub_db;

-- Create user
CREATE USER fashionhub_user WITH PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE fashionhub_db TO fashionhub_user;
```

## 🚀 **Deployment Options**

### **1. Docker (Recommended)**
- Single image deployment
- Easy scaling and management
- Production-ready configuration

### **2. Kubernetes**
- Enterprise-grade orchestration
- Automatic scaling and failover
- Advanced monitoring and logging

### **3. Traditional VM**
- Direct deployment on VM
- Full control over environment
- Custom configuration options

## 📚 **Documentation**

- **[Production Deployment](PRODUCTION_DEPLOYMENT.md)** - Complete production setup guide
- **[Architecture Guide](SINGLE_IMAGE_ARCHITECTURE.md)** - Detailed architecture explanation
- **[GitLab CI Setup](GITLAB_CI_SETUP.md)** - CI/CD pipeline configuration
- **[Kubernetes Deployment](KUBERNETES_DEPLOYMENT.md)** - K8s deployment guide
- **[API Documentation](docs/api-endpoints.md)** - API reference
- **[Database Schema](docs/database-schema.md)** - Database design

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Documentation**: Check the `docs/` folder
- **Issues**: Create an issue on GitLab
- **Email**: support@fashionhub.com

## 🏆 **Professional Features**

- ✅ **Enterprise Security** - Production-ready security measures
- ✅ **Scalable Architecture** - Designed for high traffic
- ✅ **Modern Tech Stack** - Latest technologies and best practices
- ✅ **Comprehensive Testing** - Unit and integration tests
- ✅ **Professional CI/CD** - Automated deployment pipeline
- ✅ **Configuration Management** - Environment-based configuration
- ✅ **Monitoring Ready** - Built-in logging and health checks
- ✅ **Production Documentation** - Complete deployment guides

---

**Built with ❤️ by the FashionHub Team**