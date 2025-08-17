# GitLab CI/CD Setup Guide for FashionHub Online Store

This guide explains how to set up and use the GitLab CI/CD pipeline for building a single combined Docker image for Kubernetes deployment.

## 🚀 Pipeline Overview

The pipeline consists of 4 main stages:

1. **Validate** - Code quality checks and dependency validation
2. **Test** - Unit tests, integration tests, and security scans
3. **Build** - Single combined Docker image building with proper tagging
4. **Tag** - Push combined image to container registry

## 📋 Prerequisites

- GitLab project with CI/CD enabled
- Docker registry access (GitLab Container Registry)
- Kubernetes cluster for deployment (separate from CI/CD)
- **PostgreSQL will be deployed as a Kubernetes service**
- **Redis will be deployed as a Kubernetes service**

## 🔧 Required Environment Variables

Set these in your GitLab project's **Settings > CI/CD > Variables**:

### Docker Registry (GitLab Container Registry)
```
CI_REGISTRY_USER          # GitLab username
CI_REGISTRY_PASSWORD      # GitLab personal access token
CI_REGISTRY               # registry.gitlab.com
CI_REGISTRY_IMAGE         # registry.gitlab.com/your-username/your-project
```

## 🏷️ Creating Tags for Image Building

### 1. Create a Tag Locally
```bash
# Create and push a new tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### 2. Create Tag via GitLab UI
1. Go to **Repository > Tags**
2. Click **New tag**
3. Enter tag name (e.g., `v1.0.0`)
4. Add description
5. Click **Create tag**

## 🔄 Pipeline Triggers

The pipeline runs automatically on:
- **Merge Requests** - Runs validate and test stages
- **Main Branch** - Runs all stages including image building and tagging
- **Develop Branch** - Runs all stages including image building and tagging
- **Tags** - Runs all stages including image building and tagging

## 📊 Pipeline Stages Breakdown

### Validate Stage
- **Structure Validation**: Checks if all required project files exist
- **Backend Validation**: Checks dependencies, Prisma schema, security audits
- **Frontend Validation**: Checks dependencies, TypeScript configuration

### Test Stage
- **Backend Tests**: Runs unit tests with database and Redis services
- **Frontend Tests**: Runs frontend tests (if configured)
- **Security Scan**: Runs npm audit on both services
- **Documentation**: Generates API documentation
- **Performance**: Runs performance tests (if configured)

### Build Stage
- **Combined Build**: Builds single Docker image containing both frontend and backend

### Tag Stage
- **Combined Tag**: Pushes combined image to registry with version tags

## 🐳 Docker Images Created

### Tag Builds (e.g., v1.0.0)
- `fashionhub:v1.0.0` - Versioned combined image
- `fashionhub:latest` - Latest combined image

### Branch Builds
- `fashionhub:main` / `fashionhub:develop` - Branch-specific combined images
- `fashionhub:{commit-sha}` - Commit-specific combined images

## 🔍 Monitoring and Debugging

### Pipeline Logs
- View logs in GitLab CI/CD > Pipelines
- Each job shows detailed output and error messages

### Artifacts
- Test coverage reports
- Performance test results
- Generated documentation

### Image Registry
- Check built images in GitLab Container Registry
- Verify image tags and sizes
- Pull images for local testing

## 🚨 Troubleshooting

### Common Issues

1. **Docker Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json files
   - Check for missing files in build context

2. **Registry Push Failures**
   - Verify registry credentials
   - Check image naming conventions
   - Ensure registry has sufficient storage

3. **Validation Failures**
   - Check for missing dependencies
   - Verify TypeScript configuration
   - Ensure Prisma schema is valid

### Debug Commands

```bash
# Check pipeline status
gitlab-ci-lint .gitlab-ci.yml

# View pipeline logs
gitlab-ci-logs

# Test Docker builds locally
docker build -t test-fashionhub .

# Pull and test built images
docker pull registry.gitlab.com/your-username/your-project/fashionhub:v1.0.0
docker run -p 3000:3000 -p 5000:5000 registry.gitlab.com/your-username/your-project/fashionhub:v1.0.0
```

## 🔐 Security Considerations

- Store sensitive data in GitLab CI/CD variables (not in code)
- Use personal access tokens with minimal required permissions
- Regularly rotate access tokens
- Enable branch protection rules
- Require merge request approvals

## 📈 Performance Optimization

- Cache node_modules between jobs
- Use multi-stage Docker builds
- Parallel job execution where possible
- Clean up Docker images after builds

## 🎯 Next Steps

1. **Set up environment variables** in GitLab
2. **Test the pipeline** with a small change
3. **Create your first tag** for image building
4. **Deploy to Kubernetes** using the built combined image
5. **Monitor pipeline performance** and optimize as needed

## 🚀 Kubernetes Deployment

After building the combined image, deploy it to Kubernetes:

1. **Pull combined image** from GitLab Container Registry
2. **Apply Kubernetes manifests** (see `KUBERNETES_DEPLOYMENT.md`)
3. **Update deployment** with new image tags
4. **Monitor deployment** status and health

## 🗄️ Kubernetes Database Services

### **PostgreSQL Database**
- **Deployed as Kubernetes service** in the same namespace
- **Service name**: `postgres-service`
- **Port**: 5432
- **Database**: fashionhub_db
- **User**: fashionhub_user
- **Password**: Stored in Kubernetes secrets

### **Redis Instance**
- **Deployed as Kubernetes service** in the same namespace
- **Service name**: `redis-service`
- **Port**: 6379
- **Password**: Stored in Kubernetes secrets

### **Connection Details**
The application automatically connects to:
- `DATABASE_URL`: `postgresql://fashionhub_user:password@postgres-service:5432/fashionhub_db`
- `REDIS_URL`: `redis://:password@redis-service:6379`

## 📚 Additional Resources

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Kubernetes Deployment Guide](KUBERNETES_DEPLOYMENT.md)

---

**Note**: This pipeline is configured for building a single combined Docker image containing both frontend and backend services. PostgreSQL and Redis are deployed as Kubernetes services in the same namespace. See `KUBERNETES_DEPLOYMENT.md` for deployment instructions.
