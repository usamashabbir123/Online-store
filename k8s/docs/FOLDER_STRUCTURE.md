# FashionHub Kubernetes Folder Structure

This document explains the organized Kubernetes folder structure for the FashionHub project.

## 📁 **Complete Folder Structure**

```
k8s/
├── base/                           # Base Kustomization configuration
│   └── kustomization.yaml         # Base resources configuration
│
├── overlays/                       # Environment-specific configurations
│   ├── development/               # Development environment
│   │   ├── kustomization.yaml    # Development overlay config
│   │   ├── deployment-patch.yaml # Development deployment patches
│   │   └── configmap-patch.yaml  # Development config patches
│   │
│   ├── staging/                   # Staging environment
│   │   ├── kustomization.yaml    # Staging overlay config
│   │   ├── deployment-patch.yaml # Staging deployment patches
│   │   └── ingress-patch.yaml    # Staging ingress patches
│   │
│   └── production/                # Production environment
│       ├── kustomization.yaml    # Production overlay config
│       ├── deployment-patch.yaml # Production deployment patches
│       └── ingress-patch.yaml    # Production ingress patches
│
├── manifests/                      # Individual Kubernetes manifests
│   ├── namespaces/                # Namespace definitions
│   │   └── fashionhub-namespace.yaml
│   │
│   ├── secrets/                   # Secret configurations
│   │   └── fashionhub-secrets.yaml
│   │
│   ├── configmaps/                # ConfigMap definitions
│   │   └── fashionhub-configmap.yaml
│   │
│   ├── deployments/               # Deployment configurations
│   │   └── fashionhub-deployment.yaml
│   │
│   ├── services/                  # Service definitions
│   │   └── fashionhub-services.yaml
│   │
│   ├── ingress/                   # Ingress configurations
│   │   └── fashionhub-ingress.yaml
│   │
│   ├── storage/                   # Persistent volume claims
│   │   └── fashionhub-persistent-volumes.yaml
│   │
│   ├── autoscaling/               # Horizontal pod autoscalers
│   │   └── fashionhub-hpa.yaml
│   │
│   └── security/                  # Network policies
│       └── fashionhub-network-policy.yaml
│
├── scripts/                        # Deployment and utility scripts
│   ├── deploy.sh                  # Original deployment script
│   ├── deploy-kustomize.sh        # Kustomize deployment script
│   └── generate-secrets.sh        # Secrets generation helper
│
└── docs/                          # Documentation
    ├── KUBERNETES_COMPLETE_SETUP.md
    ├── CI_CD_PROCESS.md
    └── FOLDER_STRUCTURE.md
```

## 🎯 **Purpose of Each Directory**

### **base/**
Contains the base Kustomization configuration that references all the base manifests. This serves as the foundation for all environment overlays.

**Key Files:**
- `kustomization.yaml` - References all base manifests and applies common labels

### **overlays/**
Contains environment-specific configurations that customize the base manifests for different deployment environments.

**Environments:**
- **development/** - Local development with minimal resources
- **staging/** - Pre-production testing environment
- **production/** - Production environment with full resources

### **manifests/**
Contains individual Kubernetes manifests organized by resource type for better maintainability.

**Resource Types:**
- **namespaces/** - Kubernetes namespace definitions
- **secrets/** - Sensitive configuration data
- **configmaps/** - Non-sensitive configuration data
- **deployments/** - Application deployment configurations
- **services/** - Service definitions for networking
- **ingress/** - External access configurations
- **storage/** - Persistent volume claims
- **autoscaling/** - Horizontal pod autoscalers
- **security/** - Network policies and security configurations

### **scripts/**
Contains deployment and utility scripts for automation.

**Scripts:**
- `deploy.sh` - Original deployment script
- `deploy-kustomize.sh` - Kustomize-based deployment script
- `generate-secrets.sh` - Helper for generating base64-encoded secrets

### **docs/**
Contains comprehensive documentation for the Kubernetes setup.

**Documentation:**
- `KUBERNETES_COMPLETE_SETUP.md` - Complete setup guide
- `CI_CD_PROCESS.md` - CI/CD pipeline documentation
- `FOLDER_STRUCTURE.md` - This file

## 🔧 **How to Use This Structure**

### **1. Development Deployment**

```bash
# Deploy to development environment
kustomize build k8s/overlays/development | kubectl apply -f -

# Or use the script
./k8s/scripts/deploy-kustomize.sh development
```

### **2. Staging Deployment**

```bash
# Deploy to staging environment
kustomize build k8s/overlays/staging | kubectl apply -f -

# Or use the script
./k8s/scripts/deploy-kustomize.sh staging
```

### **3. Production Deployment**

```bash
# Deploy to production environment
kustomize build k8s/overlays/production | kubectl apply -f -

# Or use the script
./k8s/scripts/deploy-kustomize.sh production
```

### **4. Manual Deployment (Individual Resources)**

```bash
# Deploy individual resources
kubectl apply -f k8s/manifests/namespaces/
kubectl apply -f k8s/manifests/secrets/
kubectl apply -f k8s/manifests/configmaps/
kubectl apply -f k8s/manifests/deployments/
kubectl apply -f k8s/manifests/services/
kubectl apply -f k8s/manifests/ingress/
kubectl apply -f k8s/manifests/storage/
kubectl apply -f k8s/manifests/autoscaling/
kubectl apply -f k8s/manifests/security/
```

## 🎨 **Benefits of This Structure**

### **1. Organization**
- **Clear separation** of concerns
- **Easy navigation** and maintenance
- **Logical grouping** of related resources

### **2. Environment Management**
- **Environment-specific** configurations
- **Easy switching** between environments
- **Consistent base** with environment overlays

### **3. Maintainability**
- **Modular design** for easy updates
- **Version control** friendly
- **Team collaboration** optimized

### **4. Scalability**
- **Easy to add** new environments
- **Simple to extend** with new resources
- **Flexible configuration** management

## 🔄 **Workflow Integration**

### **CI/CD Pipeline**
The folder structure integrates seamlessly with the CI/CD pipeline:

1. **Build Stage**: Creates Docker image
2. **Tag Stage**: Pushes image to registry
3. **Deploy Stage**: Uses Kustomize to deploy to target environment

### **GitOps Workflow**
1. **Code Changes**: Committed to repository
2. **Pipeline Execution**: Validates, tests, and builds
3. **Image Creation**: Docker image with tag
4. **Deployment**: Kustomize applies environment-specific configuration

## 🛠️ **Customization**

### **Adding New Environments**
1. Create new directory in `overlays/`
2. Add `kustomization.yaml` with environment-specific config
3. Create necessary patch files
4. Update deployment scripts

### **Adding New Resources**
1. Create new directory in `manifests/`
2. Add resource YAML files
3. Update base `kustomization.yaml`
4. Add environment-specific patches if needed

### **Modifying Existing Resources**
1. Update base manifest in `manifests/`
2. Create patch files in environment overlays
3. Test changes in development first
4. Deploy to staging and production

## 📋 **Best Practices**

### **1. File Naming**
- Use descriptive names: `fashionhub-deployment.yaml`
- Include resource type in filename
- Use consistent naming conventions

### **2. Organization**
- Group related resources together
- Keep base manifests simple
- Use overlays for environment-specific changes

### **3. Version Control**
- Commit all changes to version control
- Use meaningful commit messages
- Tag releases appropriately

### **4. Documentation**
- Keep documentation up to date
- Document environment-specific configurations
- Maintain troubleshooting guides

---

**Note**: This folder structure follows Kubernetes and Kustomize best practices, providing a scalable and maintainable approach to managing multiple environments and resources.
