# GitLab CI/CD Setup Guide for FashionHub Online Store

This guide explains how to set up and use the GitLab CI/CD pipeline for your FashionHub project.

## 🚀 Pipeline Overview

The pipeline consists of 4 main stages:

1. **Validate** - Code quality checks and dependency validation
2. **Test** - Unit tests, integration tests, and security scans
3. **Build** - Docker image building and pushing to registry
4. **Deploy** - Deployment to staging and production environments

## 📋 Prerequisites

- GitLab project with CI/CD enabled
- Docker registry access (GitLab Container Registry or external)
- SSH access to deployment servers
- PostgreSQL and Redis for testing

## 🔧 Required Environment Variables

Set these in your GitLab project's **Settings > CI/CD > Variables**:

### Docker Registry (GitLab Container Registry)
```
CI_REGISTRY_USER          # GitLab username
CI_REGISTRY_PASSWORD      # GitLab personal access token
CI_REGISTRY               # registry.gitlab.com
CI_REGISTRY_IMAGE         # registry.gitlab.com/your-username/your-project
```

### Staging Environment
```
STAGING_SSH_PRIVATE_KEY   # SSH private key for staging server
STAGING_SSH_KNOWN_HOSTS   # SSH known hosts for staging server
STAGING_SSH_USER          # SSH username for staging server
STAGING_SSH_HOST          # Staging server hostname/IP
STAGING_DEPLOY_PATH       # Path to docker-compose.yml on staging server
STAGING_URL               # Staging environment URL
```

### Production Environment
```
PRODUCTION_SSH_PRIVATE_KEY    # SSH private key for production server
PRODUCTION_SSH_KNOWN_HOSTS    # SSH known hosts for production server
PRODUCTION_SSH_USER           # SSH username for production server
PRODUCTION_SSH_HOST           # Production server hostname/IP
PRODUCTION_DEPLOY_PATH        # Path to docker-compose.yml on production server
PRODUCTION_URL                # Production environment URL
```

## 🏷️ Creating Tags for Deployment

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
- **Main Branch** - Runs all stages including production deployment
- **Develop Branch** - Runs all stages including staging deployment
- **Tags** - Runs all stages including production deployment (manual trigger)

## 📊 Pipeline Stages Breakdown

### Validate Stage
- **Backend Validation**: Checks dependencies, Prisma schema, security audits
- **Frontend Validation**: Checks dependencies, TypeScript configuration

### Test Stage
- **Backend Tests**: Runs unit tests with database and Redis services
- **Frontend Tests**: Runs frontend tests (if configured)
- **Security Scan**: Runs npm audit on both services
- **Documentation**: Generates API documentation
- **Performance**: Runs performance tests (if configured)

### Build Stage
- **Backend Build**: Builds and pushes backend Docker image
- **Frontend Build**: Builds and pushes frontend Docker image

### Deploy Stage
- **Staging**: Automatic deployment to staging environment
- **Production**: Manual deployment to production environment

## 🐳 Docker Images

The pipeline builds and pushes two Docker images:
- `backend:latest` and `backend:{commit-sha}`
- `frontend:latest` and `frontend:{commit-sha}`

## 🔍 Monitoring and Debugging

### Pipeline Logs
- View logs in GitLab CI/CD > Pipelines
- Each job shows detailed output and error messages

### Artifacts
- Test coverage reports
- Performance test results
- Generated documentation

### Health Checks
- Backend health check at `/health` endpoint
- Docker health checks for containers

## 🚨 Troubleshooting

### Common Issues

1. **Docker Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json
   - Check for missing files in build context

2. **Database Connection Issues**
   - Verify PostgreSQL service is running
   - Check database credentials in environment variables
   - Ensure Prisma schema is valid

3. **SSH Connection Failures**
   - Verify SSH private key is correct
   - Check server accessibility
   - Verify known_hosts entry

4. **Permission Issues**
   - Ensure SSH keys have correct permissions
   - Check file ownership on deployment servers

### Debug Commands

```bash
# Check pipeline status
gitlab-ci-lint .gitlab-ci.yml

# View pipeline logs
gitlab-ci-logs

# Test Docker builds locally
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend
```

## 🔐 Security Considerations

- Store sensitive data in GitLab CI/CD variables (not in code)
- Use SSH keys instead of passwords
- Regularly rotate access tokens and keys
- Enable branch protection rules
- Require merge request approvals

## 📈 Performance Optimization

- Cache node_modules between jobs
- Use multi-stage Docker builds
- Parallel job execution where possible
- Clean up Docker images after builds

## 🎯 Next Steps

1. **Set up environment variables** in GitLab
2. **Configure deployment servers** with SSH access
3. **Test the pipeline** with a small change
4. **Create your first tag** for production deployment
5. **Monitor pipeline performance** and optimize as needed

## 📚 Additional Resources

- [GitLab CI/CD Documentation](https://docs.gitlab.com/ee/ci/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Note**: This pipeline is configured for a typical development workflow. Adjust stages, jobs, and triggers based on your specific requirements and team workflow.
