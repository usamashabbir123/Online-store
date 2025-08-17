# FashionHub CI/CD Process Documentation

This document describes the complete CI/CD pipeline for FashionHub, from code commit to production deployment.

## 🎯 **Overview**

The CI/CD pipeline follows a **GitOps** approach with the following stages:

1. **Validate** - Code quality and structure validation
2. **Test** - Unit tests, integration tests, and security scans
3. **Build** - Docker image creation
4. **Tag** - Image tagging and registry push

## 📋 **Pipeline Stages**

### **Stage 1: Validate**

#### **validate:structure**
- **Purpose**: Validates project structure and file existence
- **Checks**:
  - Backend files (package.json, server.js, Prisma schema)
  - Frontend files (package.json, Next.js config, pages)
- **Triggers**: Merge requests, main, develop, tags

#### **validate:backend**
- **Purpose**: Validates backend dependencies and configuration
- **Checks**:
  - npm audit for security vulnerabilities
  - Prisma schema validation
  - Dependency installation
- **Services**: PostgreSQL, Redis
- **Triggers**: Merge requests, main, develop, tags

#### **validate:frontend**
- **Purpose**: Validates frontend dependencies and configuration
- **Checks**:
  - npm audit for security vulnerabilities
  - TypeScript configuration validation
  - Dependency installation
- **Triggers**: Merge requests, main, develop, tags

### **Stage 2: Test**

#### **test:backend**
- **Purpose**: Runs backend unit and integration tests
- **Features**:
  - Jest test runner
  - Database integration tests
  - Coverage reporting
  - Seed data setup
- **Services**: PostgreSQL, Redis
- **Artifacts**: Coverage reports
- **Triggers**: Merge requests, main, develop, tags

#### **test:frontend**
- **Purpose**: Runs frontend tests
- **Features**:
  - Component testing
  - Integration testing
  - Coverage reporting
- **Artifacts**: Coverage reports
- **Triggers**: Merge requests, main, develop, tags

#### **security:scan**
- **Purpose**: Security vulnerability scanning
- **Features**:
  - npm audit for both frontend and backend
  - Dependency vulnerability checks
- **Triggers**: Merge requests, main, develop, tags

#### **docs:generate**
- **Purpose**: Generates API documentation
- **Features**:
  - API documentation generation
  - Swagger/OpenAPI specs
- **Artifacts**: Documentation files
- **Triggers**: main, tags

#### **performance:test**
- **Purpose**: Performance testing
- **Features**:
  - Artillery load testing
  - Performance metrics collection
- **Artifacts**: Performance reports
- **Triggers**: main, tags

### **Stage 3: Build**

#### **build:combined**
- **Purpose**: Builds single combined Docker image
- **Features**:
  - Multi-stage Docker build
  - Frontend and backend in single image
  - Optimized for production
- **Image Tags**:
  - Tag builds: `fashionhub:$CI_COMMIT_TAG` and `fashionhub:latest`
  - Branch builds: `fashionhub:$CI_COMMIT_REF_SLUG` and `fashionhub:$CI_COMMIT_SHA`
- **Triggers**: main, develop, tags

### **Stage 4: Tag**

#### **tag:combined**
- **Purpose**: Pushes images to GitLab Container Registry
- **Features**:
  - Image tagging and pushing
  - Registry authentication
  - Version management
- **Triggers**: main, develop, tags

## 🔧 **Configuration**

### **Environment Variables**

```yaml
# Docker configuration
DOCKER_DRIVER: overlay2
DOCKER_TLS_CERTDIR: "/certs"

# Node.js version
NODE_VERSION: "18"

# Database URLs for testing
DATABASE_URL: "postgresql://test_user:test_password@postgres:5432/test_db"
REDIS_URL: "redis://:test_password@redis:6379"

# Image tags
IMAGE_TAG: $CI_COMMIT_TAG
IMAGE_TAG_LATEST: "latest"
IMAGE_TAG_MAIN: "main"
```

### **Required GitLab Variables**

```bash
# GitLab Container Registry
CI_REGISTRY_USER
CI_REGISTRY_PASSWORD
CI_REGISTRY
CI_REGISTRY_IMAGE

# Database (for testing)
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
REDIS_PASSWORD

# Application secrets (for testing)
JWT_SECRET
JWT_REFRESH_SECRET
```

## 🚀 **Deployment Process**

### **1. Tag Creation**

```bash
# Create a new tag
git tag v1.0.0
git push origin v1.0.0
```

### **2. Pipeline Execution**

1. **Validate Stage**: Ensures code quality and structure
2. **Test Stage**: Runs all tests and security scans
3. **Build Stage**: Creates Docker image
4. **Tag Stage**: Pushes image to registry

### **3. Kubernetes Deployment**

```bash
# Deploy to production
./k8s/scripts/deploy-kustomize.sh production

# Deploy to staging
./k8s/scripts/deploy-kustomize.sh staging

# Deploy to development
./k8s/scripts/deploy-kustomize.sh development
```

## 📊 **Pipeline Triggers**

### **Automatic Triggers**
- **Merge Requests**: Runs validate and test stages
- **Main Branch**: Runs all stages
- **Develop Branch**: Runs all stages
- **Tags**: Runs all stages (production deployment)

### **Manual Triggers**
- **Security Scans**: Can be triggered manually
- **Performance Tests**: Can be triggered manually
- **Documentation Generation**: Can be triggered manually

## 🔍 **Monitoring and Debugging**

### **Pipeline Status**
- Check pipeline status in GitLab CI/CD interface
- View job logs for detailed error information
- Monitor test coverage and performance metrics

### **Common Issues**

#### **Build Failures**
```bash
# Check Docker build logs
docker build -t test-image .

# Verify Dockerfile syntax
docker build --no-cache -t test-image .
```

#### **Test Failures**
```bash
# Run tests locally
cd backend && npm test
cd frontend && npm test

# Check database connectivity
docker-compose up -d postgres redis
```

#### **Deployment Issues**
```bash
# Check Kubernetes resources
kubectl get pods -n fashionhub
kubectl describe pod <pod-name> -n fashionhub
kubectl logs <pod-name> -n fashionhub
```

## 🛡️ **Security Features**

### **Security Scanning**
- **npm audit**: Dependency vulnerability scanning
- **Container scanning**: Docker image security analysis
- **Code quality**: ESLint and TypeScript checks

### **Secrets Management**
- **GitLab Variables**: Secure storage of sensitive data
- **Kubernetes Secrets**: Encrypted secret storage
- **Environment Isolation**: Separate secrets per environment

## 📈 **Performance Optimization**

### **Build Optimization**
- **Multi-stage builds**: Reduced image size
- **Layer caching**: Faster builds
- **Dependency caching**: Faster installations

### **Test Optimization**
- **Parallel execution**: Faster test runs
- **Selective testing**: Only changed components
- **Caching**: Reuse dependencies

## 🔄 **Rollback Process**

### **Image Rollback**
```bash
# Rollback to previous image
kubectl set image deployment/fashionhub-app \
  fashionhub=registry.gitlab.com/username/project/fashionhub:v1.0.0 \
  -n fashionhub
```

### **Deployment Rollback**
```bash
# Rollback deployment
kubectl rollout undo deployment/fashionhub-app -n fashionhub

# Check rollback status
kubectl rollout status deployment/fashionhub-app -n fashionhub
```

## 📚 **Best Practices**

### **Code Quality**
- Write comprehensive tests
- Follow coding standards
- Use meaningful commit messages
- Review code before merging

### **Security**
- Regular dependency updates
- Security scanning in pipeline
- Secrets management
- Access control

### **Performance**
- Optimize Docker images
- Cache dependencies
- Parallel job execution
- Resource monitoring

## 🚨 **Troubleshooting**

### **Pipeline Failures**
1. Check job logs for specific errors
2. Verify environment variables
3. Test locally if possible
4. Check resource availability

### **Deployment Issues**
1. Verify Kubernetes cluster access
2. Check resource quotas
3. Validate manifests
4. Monitor pod logs

### **Performance Issues**
1. Monitor resource usage
2. Check network connectivity
3. Verify database performance
4. Analyze application logs

---

**Note**: This CI/CD process is designed for production use and follows industry best practices for security, reliability, and maintainability.
