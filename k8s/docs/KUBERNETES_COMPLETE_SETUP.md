# FashionHub Complete Kubernetes Setup

This guide provides a complete Kubernetes deployment setup for FashionHub with all necessary files and configurations.

## 🎯 **Overview**

This setup includes:
- **Complete Kubernetes manifests** for production deployment
- **Best practices** for environment variable management
- **Security configurations** with network policies
- **Auto-scaling** with Horizontal Pod Autoscaler
- **Persistent storage** for uploads and logs
- **Automated deployment scripts**

## 📁 **File Structure**

```
k8s/
├── namespace.yaml              # Kubernetes namespace
├── secrets.yaml                # Sensitive environment variables
├── configmap.yaml              # Non-sensitive configuration
├── deployment.yaml             # Application deployment
├── services.yaml               # Frontend and backend services
├── ingress.yaml                # External access configuration
├── persistent-volumes.yaml     # Storage configuration
├── hpa.yaml                    # Auto-scaling configuration
├── network-policy.yaml         # Security policies
├── deploy.sh                   # Automated deployment script
└── generate-secrets.sh         # Secrets generation helper
```

## 🔐 **Environment Variables Best Practice**

### **Kubernetes Approach (Recommended)**

For Kubernetes, we use **three layers** of configuration:

1. **Kubernetes Secrets** - For sensitive data (passwords, API keys)
2. **Kubernetes ConfigMaps** - For non-sensitive configuration
3. **Direct Environment Variables** - For simple values

### **Why This Approach?**

- ✅ **Security** - Secrets are encrypted and access-controlled
- ✅ **Flexibility** - Easy to update without rebuilding images
- ✅ **Kubernetes Native** - Follows Kubernetes best practices
- ✅ **Scalability** - Works across multiple environments
- ✅ **Audit Trail** - Kubernetes tracks all changes

## 🚀 **Quick Deployment**

### **1. Prerequisites**

```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Verify installation
kubectl version --client
```

### **2. Generate Secrets**

```bash
# Make script executable
chmod +x k8s/generate-secrets.sh

# Run secrets generator
./k8s/generate-secrets.sh
```

### **3. Update Configuration Files**

```bash
# Update secrets.yaml with generated values
nano k8s/secrets.yaml

# Update deployment.yaml with your image
nano k8s/deployment.yaml

# Update ingress.yaml with your domain
nano k8s/ingress.yaml
```

### **4. Deploy Application**

```bash
# Make deployment script executable
chmod +x k8s/deploy.sh

# Run deployment
./k8s/deploy.sh
```

## 📋 **Detailed Configuration**

### **1. Namespace**

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: fashionhub
  labels:
    name: fashionhub
    app: fashionhub
```

### **2. Secrets (Sensitive Data)**

```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: fashionhub-secrets
  namespace: fashionhub
type: Opaque
data:
  postgres-password: <base64-encoded>
  redis-password: <base64-encoded>
  jwt-secret: <base64-encoded>
  # ... more secrets
```

### **3. ConfigMap (Non-sensitive Data)**

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fashionhub-config
  namespace: fashionhub
data:
  NODE_ENV: "production"
  PORT: "5000"
  DATABASE_HOST: "localhost"
  # ... more config
```

### **4. Deployment**

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fashionhub-app
  namespace: fashionhub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fashionhub
  template:
    spec:
      containers:
        - name: fashionhub
          image: your-registry/fashionhub:latest
          envFrom:
            - configMapRef:
                name: fashionhub-config
          env:
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: postgres-password
          # ... more environment variables
```

## 🔧 **Configuration Management**

### **Environment Variables Hierarchy**

1. **Kubernetes Secrets** (Highest Priority)
   - Database passwords
   - API keys
   - JWT secrets
   - SMTP credentials

2. **Kubernetes ConfigMaps** (Medium Priority)
   - Application settings
   - Database connection details
   - Logging configuration
   - Security settings

3. **Direct Environment Variables** (Lowest Priority)
   - Simple flags
   - Feature toggles
   - Default values

### **Benefits of This Approach**

- **Security**: Sensitive data is encrypted and access-controlled
- **Flexibility**: Easy to update configuration without rebuilding images
- **Environment Isolation**: Different configs for dev/staging/prod
- **Audit Trail**: Kubernetes tracks all configuration changes
- **Rollback**: Easy to revert configuration changes

## 🌐 **Network Configuration**

### **Services**

- **Frontend Service**: Exposes port 3000
- **Backend Service**: Exposes port 5000
- **Type**: ClusterIP (internal access)

### **Ingress**

- **Domain**: fashionhub.yourdomain.com
- **SSL**: Automatic with cert-manager
- **Routing**:
  - `/api/*` → Backend service
  - `/uploads/*` → Backend service
  - `/*` → Frontend service

### **Network Policy**

- **Ingress**: Allows traffic from ingress controller
- **Egress**: Allows DNS and external HTTPS
- **Security**: Restricts unnecessary network access

## 📊 **Monitoring and Scaling**

### **Health Checks**

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### **Auto-scaling**

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

## 💾 **Storage Configuration**

### **Persistent Volumes**

- **Uploads PVC**: 10GB for file uploads
- **Logs PVC**: 5GB for application logs
- **Access Mode**: ReadWriteMany (shared access)

### **Volume Mounts**

```yaml
volumeMounts:
  - name: uploads-volume
    mountPath: /app/uploads
  - name: logs-volume
    mountPath: /app/logs
```

## 🔒 **Security Features**

### **Pod Security**

```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  allowPrivilegeEscalation: false
```

### **Network Security**

- **Network Policy**: Restricts pod-to-pod communication
- **Ingress Security**: SSL/TLS encryption
- **Secret Management**: Encrypted at rest

## 🚀 **Deployment Commands**

### **Manual Deployment**

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets
kubectl apply -f k8s/secrets.yaml

# Create ConfigMap
kubectl apply -f k8s/configmap.yaml

# Create PVCs
kubectl apply -f k8s/persistent-volumes.yaml

# Create deployment
kubectl apply -f k8s/deployment.yaml

# Create services
kubectl apply -f k8s/services.yaml

# Create ingress
kubectl apply -f k8s/ingress.yaml

# Create HPA
kubectl apply -f k8s/hpa.yaml

# Create network policy
kubectl apply -f k8s/network-policy.yaml
```

### **Automated Deployment**

```bash
# Run complete deployment
./k8s/deploy.sh
```

## 📈 **Scaling and Updates**

### **Scale Deployment**

```bash
# Scale to 5 replicas
kubectl scale deployment/fashionhub-app --replicas=5 -n fashionhub

# Auto-scale based on CPU
kubectl autoscale deployment/fashionhub-app --cpu-percent=70 --min=3 --max=10 -n fashionhub
```

### **Update Application**

```bash
# Update to new image
kubectl set image deployment/fashionhub-app \
  fashionhub=registry.gitlab.com/username/project/fashionhub:v1.1.0 \
  -n fashionhub

# Rollback if needed
kubectl rollout undo deployment/fashionhub-app -n fashionhub
```

## 🔍 **Monitoring and Debugging**

### **View Logs**

```bash
# View application logs
kubectl logs -f deployment/fashionhub-app -n fashionhub

# View specific pod logs
kubectl logs -f pod/fashionhub-app-xyz123 -n fashionhub
```

### **Port Forwarding**

```bash
# Forward frontend service
kubectl port-forward service/fashionhub-frontend-service 3000:80 -n fashionhub

# Forward backend service
kubectl port-forward service/fashionhub-backend-service 5000:80 -n fashionhub
```

### **Check Status**

```bash
# Check all resources
kubectl get all -n fashionhub

# Check specific resource
kubectl get pods -n fashionhub
kubectl get services -n fashionhub
kubectl get ingress -n fashionhub
kubectl get pvc -n fashionhub
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Image Pull Errors**
   ```bash
   # Check image pull secret
   kubectl get secret gitlab-registry -n fashionhub
   
   # Create registry secret
   kubectl create secret docker-registry gitlab-registry \
     --docker-server=registry.gitlab.com \
     --docker-username=YOUR_USERNAME \
     --docker-password=YOUR_ACCESS_TOKEN \
     -n fashionhub
   ```

2. **PVC Binding Issues**
   ```bash
   # Check storage class
   kubectl get storageclass
   
   # Check PVC status
   kubectl get pvc -n fashionhub
   ```

3. **Ingress Issues**
   ```bash
   # Check ingress controller
   kubectl get pods -n ingress-nginx
   
   # Check ingress status
   kubectl describe ingress fashionhub-ingress -n fashionhub
   ```

## 📚 **Additional Resources**

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kubernetes Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Kubernetes ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Kubernetes Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)

---

**Note**: This setup follows Kubernetes best practices and provides a production-ready deployment configuration. Always test in a staging environment first.
