# FashionHub Single Image Architecture

This document explains the new single-image architecture for FashionHub, where both frontend and backend services are packaged into one Docker image.

## 🎯 **Architecture Overview**

### **Before (Multi-Image Approach)**
- ❌ Separate `backend:v1.0.0` image
- ❌ Separate `frontend:v1.0.0` image
- ❌ Complex service orchestration
- ❌ Multiple image pulls and deployments

### **After (Single Image Approach)**
- ✅ Single `fashionhub:v1.0.0` image
- ✅ Contains both frontend and backend
- ✅ Simplified deployment
- ✅ Single image pull and deployment

## 🏗️ **Image Structure**

```
fashionhub:v1.0.0
├── /app
│   ├── /backend          # Backend Node.js application
│   │   ├── src/         # Backend source code
│   │   ├── node_modules/ # Backend dependencies
│   │   └── package.json
│   ├── /frontend         # Frontend Next.js application
│   │   ├── .next/       # Built Next.js files
│   │   ├── public/      # Static assets
│   │   ├── node_modules/ # Frontend dependencies
│   │   └── package.json
│   ├── /scripts         # Startup scripts
│   ├── /uploads         # File uploads directory
│   └── /logs           # Application logs
```

## 🔄 **Service Management**

### **Startup Process**
1. **Main script** (`start.sh`) starts both services
2. **Backend service** starts on port 5000
3. **Frontend service** starts on port 3000
4. **Process management** handles graceful shutdown

### **Port Configuration**
- **Frontend**: Port 3000 (Next.js)
- **Backend**: Port 5000 (Express.js)
- **Health Check**: Backend `/health` endpoint

## 🗄️ **Kubernetes Database Services**

### **PostgreSQL Database**
- **Deployed as Kubernetes service** in the same namespace
- **Service name**: `postgres-service`
- **Port**: 5432
- **Database**: fashionhub_db
- **User**: fashionhub_user
- **Password**: Stored in Kubernetes secrets
- **Connection**: `postgresql://fashionhub_user:password@postgres-service:5432/fashionhub_db`

### **Redis Instance**
- **Deployed as Kubernetes service** in the same namespace
- **Service name**: `redis-service`
- **Port**: 6379
- **Password**: Stored in Kubernetes secrets
- **Connection**: `redis://:password@redis-service:6379`

## 🚀 **GitLab CI Pipeline Changes**

### **Build Stage**
```yaml
build:combined:
  stage: build
  script:
    - docker build -t $CI_REGISTRY_IMAGE/fashionhub:$CI_COMMIT_TAG .
    - docker build -t $CI_REGISTRY_IMAGE/fashionhub:latest .
```

### **Tag Stage**
```yaml
tag:combined:
  stage: tag
  script:
    - docker push $CI_REGISTRY_IMAGE/fashionhub:$CI_COMMIT_TAG
    - docker push $CI_REGISTRY_IMAGE/fashionhub:latest
```

## 🐳 **Dockerfile Structure**

### **Multi-Stage Build**
1. **Base**: Node.js 18 Alpine with system dependencies
2. **Backend Dependencies**: Install backend npm packages
3. **Frontend Dependencies**: Install frontend npm packages
4. **Backend Build**: Build backend application
5. **Frontend Build**: Build Next.js application
6. **Runtime**: Combine everything into final image

### **Key Features**
- **Multi-stage optimization** for smaller final image
- **Non-root user** for security
- **Health checks** for monitoring
- **Graceful shutdown** handling

## 📋 **Kubernetes Deployment Changes**

### **Single Deployment**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fashionhub-app
spec:
  template:
    spec:
      containers:
        - name: fashionhub
          image: registry.gitlab.com/username/project/fashionhub:v1.0.0
          ports:
            - name: frontend
              containerPort: 3000
            - name: backend
              containerPort: 5000
```

### **Services**
```yaml
# Frontend service
- name: fashionhub-frontend-service
  targetPort: 3000

# Backend service  
- name: fashionhub-backend-service
  targetPort: 5000

# PostgreSQL service
- name: postgres-service
  targetPort: 5432

# Redis service
- name: redis-service
  targetPort: 6379
```

## 🔧 **Environment Variables**

### **Required Variables**
```bash
NODE_ENV=production
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
DATABASE_URL=postgresql://fashionhub_user:password@postgres-service:5432/fashionhub_db
REDIS_URL=redis://:password@redis-service:6379
JWT_SECRET=your-secret-key
```

### **Optional Variables**
```bash
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=your-paypal-id
UPLOAD_MAX_SIZE=10485760
CORS_ORIGIN=http://localhost:3000
```

## 📊 **Resource Requirements**

### **Memory**
- **Requests**: 512Mi minimum
- **Limits**: 1Gi maximum
- **Reasoning**: Both services in single container

### **CPU**
- **Requests**: 500m minimum
- **Limits**: 1000m maximum
- **Reasoning**: Combined workload

## 🚨 **Important Considerations**

### **1. Database Setup**
- PostgreSQL deployed as Kubernetes service
- Database accessible via `postgres-service:5432`
- Proper credentials stored in Kubernetes secrets
- Persistent storage via PVC

### **2. Redis Setup**
- Redis deployed as Kubernetes service
- Redis accessible via `redis-service:6379`
- Authentication and security configured
- No persistent storage needed (cache only)

### **3. Port Conflicts**
- Ensure ports 3000 and 5000 are available
- No other services using these ports
- Firewall rules configured properly

### **4. Storage**
- `/app/uploads` directory for file uploads
- `/app/logs` directory for application logs
- Persistent volumes for PostgreSQL data

## 🔄 **Migration from Multi-Image**

### **1. Update GitLab CI**
- Remove separate backend/frontend build jobs
- Add combined build job
- Update image naming

### **2. Update Kubernetes Manifests**
- Replace separate deployments with single deployment
- Add PostgreSQL and Redis services
- Update service selectors
- Adjust resource limits

### **3. Update Environment Variables**
- Ensure all required variables are set
- Update service URLs to use Kubernetes service names
- Test connectivity to database services

## 📈 **Benefits of Single Image**

### **Advantages**
- ✅ **Simplified deployment** - One image to manage
- ✅ **Reduced complexity** - Fewer moving parts
- ✅ **Easier versioning** - Single version number
- ✅ **Better testing** - Test complete application
- ✅ **Faster deployment** - Single image pull
- ✅ **Kubernetes-native** - All services in same namespace

### **Disadvantages**
- ❌ **Larger image size** - Contains both services
- ❌ **Less flexibility** - Can't scale services independently
- ❌ **Single point of failure** - Both services in one container
- ❌ **Resource sharing** - Memory and CPU shared

## 🎯 **Use Cases**

### **Perfect For**
- **Small to medium applications**
- **Development and testing environments**
- **Simple deployments**
- **Teams new to containerization**
- **Kubernetes-native deployments**

### **Consider Alternatives For**
- **Large-scale production** (consider microservices)
- **Independent scaling needs**
- **Different deployment schedules**
- **Complex service mesh requirements**

## 🔍 **Monitoring and Debugging**

### **Health Checks**
- Backend health at `/health` endpoint
- Frontend availability at root `/` path
- Container health status in Kubernetes
- Database connectivity checks

### **Logs**
- Combined logs from both services
- Service identification in log messages
- Structured logging for better debugging
- Database and Redis logs available

### **Metrics**
- Resource usage (CPU, memory)
- Request rates and response times
- Error rates and types
- Database performance metrics

## 📚 **Next Steps**

1. **Test the single image locally**
2. **Update your GitLab CI pipeline**
3. **Deploy to Kubernetes using new manifests**
4. **Monitor performance and resource usage**
5. **Optimize based on actual usage patterns**

---

**Note**: This architecture is designed for simplicity and ease of deployment with Kubernetes-native database services. For production environments with high scalability requirements, consider evaluating if microservices architecture would be more appropriate.
