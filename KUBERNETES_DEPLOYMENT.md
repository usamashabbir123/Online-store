# Kubernetes Deployment Guide for FashionHub

This guide explains how to deploy the FashionHub application to Kubernetes using the single combined Docker image built by GitLab CI.

## 🚀 **GitLab CI Pipeline Output**

The GitLab CI pipeline builds a single combined Docker image containing both frontend and backend:

### **Image Tags Created:**
- **Tag Builds** (when you create a git tag like `v1.0.0`):
  - `fashionhub:v1.0.0` - Versioned combined image
  - `fashionhub:latest` - Latest combined image

- **Branch Builds** (for main/develop branches):
  - `fashionhub:main` / `fashionhub:develop` - Branch-specific combined images
  - `fashionhub:{commit-sha}` - Commit-specific combined images

## 📋 **Prerequisites**

- Kubernetes cluster (local or cloud)
- `kubectl` configured
- Access to GitLab Container Registry
- **PostgreSQL already running on the VM** (not in Kubernetes)
- **Redis already running on the VM** (not in Kubernetes)
- Helm (optional, for easier deployment)

## 🔐 **Registry Authentication**

### **1. Create Docker Secret for GitLab Registry**

```bash
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=YOUR_GITLAB_USERNAME \
  --docker-password=YOUR_GITLAB_ACCESS_TOKEN \
  --docker-email=YOUR_EMAIL
```

### **2. Update Namespace (if using different namespace)**

```bash
kubectl create namespace fashionhub
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=YOUR_GITLAB_USERNAME \
  --docker-password=YOUR_GITLAB_ACCESS_TOKEN \
  --docker-email=YOUR_EMAIL \
  --namespace=fashionhub
```

## 🏗️ **Kubernetes Manifests**

### **1. Combined Application Deployment**

```yaml
# fashionhub-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fashionhub-app
  labels:
    app: fashionhub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fashionhub
  template:
    metadata:
      labels:
        app: fashionhub
    spec:
      imagePullSecrets:
        - name: gitlab-registry
      containers:
        - name: fashionhub
          image: registry.gitlab.com/YOUR_USERNAME/YOUR_PROJECT/fashionhub:v1.0.0
          ports:
            - name: frontend
              containerPort: 3000
            - name: backend
              containerPort: 5000
          env:
            - name: NODE_ENV
              value: "production"
            - name: PORT
              value: "5000"
            - name: NEXT_PUBLIC_API_URL
              value: "http://localhost:5000"
            # Database Configuration (VM's PostgreSQL)
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: postgres-password
            # Redis Configuration (VM's Redis)
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: redis-password
            # Authentication
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: jwt-secret
            - name: JWT_REFRESH_SECRET
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: jwt-refresh-secret
            # Email Configuration
            - name: SMTP_HOST
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: smtp-host
            - name: SMTP_USERNAME
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: smtp-username
            - name: SMTP_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: smtp-password
            # Payment Gateway - Stripe
            - name: STRIPE_SECRET_KEY
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: stripe-secret-key
            - name: STRIPE_PUBLISHABLE_KEY
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: stripe-publishable-key
            - name: STRIPE_WEBHOOK_SECRET
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: stripe-webhook-secret
            # Payment Gateway - PayPal
            - name: PAYPAL_CLIENT_ID
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: paypal-client-id
            - name: PAYPAL_CLIENT_SECRET
              valueFrom:
                secretKeyRef:
                  name: fashionhub-secrets
                  key: paypal-client-secret
          resources:
            requests:
              memory: "512Mi"
              cpu: "500m"
            limits:
              memory: "1Gi"
              cpu: "1000m"
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

### **2. Application Services**

```yaml
# services.yaml
apiVersion: v1
kind: Service
metadata:
  name: fashionhub-frontend-service
spec:
  selector:
    app: fashionhub
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
      name: frontend
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: fashionhub-backend-service
spec:
  selector:
    app: fashionhub
  ports:
    - protocol: TCP
      port: 80
      targetPort: 5000
      name: backend
  type: ClusterIP
```

### **3. Ingress (for external access)**

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fashionhub-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - fashionhub.yourdomain.com
      secretName: fashionhub-tls
  rules:
    - host: fashionhub.yourdomain.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: fashionhub-backend-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: fashionhub-frontend-service
                port:
                  number: 80
```

### **4. Secrets**

```yaml
# secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: fashionhub-secrets
type: Opaque
data:
  # Database Configuration
  postgres-password: <base64-encoded-postgres-password>
  redis-password: <base64-encoded-redis-password>
  
  # Authentication
  jwt-secret: <base64-encoded-jwt-secret>
  jwt-refresh-secret: <base64-encoded-jwt-refresh-secret>
  
  # Email Configuration
  smtp-host: <base64-encoded-smtp-host>
  smtp-username: <base64-encoded-smtp-username>
  smtp-password: <base64-encoded-smtp-password>
  
  # Payment Gateway - Stripe
  stripe-secret-key: <base64-encoded-stripe-secret-key>
  stripe-publishable-key: <base64-encoded-stripe-publishable-key>
  stripe-webhook-secret: <base64-encoded-stripe-webhook-secret>
  
  # Payment Gateway - PayPal
  paypal-client-id: <base64-encoded-paypal-client-id>
  paypal-client-secret: <base64-encoded-paypal-client-secret>
```

## 🚀 **Deployment Commands**

### **1. Deploy to Kubernetes**

```bash
# Create namespace
kubectl create namespace fashionhub

# Apply secrets first
kubectl apply -f secrets.yaml -n fashionhub

# Apply application deployment
kubectl apply -f fashionhub-deployment.yaml -n fashionhub

# Apply services
kubectl apply -f services.yaml -n fashionhub

# Apply ingress (if using)
kubectl apply -f ingress.yaml -n fashionhub
```

### **2. Update to New Version**

```bash
# Update to new version
kubectl set image deployment/fashionhub-app \
  fashionhub=registry.gitlab.com/YOUR_USERNAME/YOUR_PROJECT/fashionhub:v1.1.0 \
  -n fashionhub
```

### **3. Rollback to Previous Version**

```bash
# Rollback
kubectl rollout undo deployment/fashionhub-app -n fashionhub
```

## 🔍 **Monitoring and Debugging**

### **1. Check Deployment Status**

```bash
# Check deployment
kubectl get deployments -n fashionhub

# Check pods
kubectl get pods -n fashionhub

# Check services
kubectl get services -n fashionhub
```

### **2. View Logs**

```bash
# View application logs
kubectl logs -f deployment/fashionhub-app -n fashionhub
```

### **3. Port Forward for Local Testing**

```bash
# Forward frontend service
kubectl port-forward service/fashionhub-frontend-service 3000:80 -n fashionhub

# Forward backend service
kubectl port-forward service/fashionhub-backend-service 5000:80 -n fashionhub
```

## 📊 **Scaling and Updates**

### **1. Scale Deployment**

```bash
# Scale to 5 replicas
kubectl scale deployment/fashionhub-app --replicas=5 -n fashionhub
```

### **2. Rolling Update Strategy**

The deployment uses RollingUpdate strategy by default:
- Zero downtime updates
- Automatic rollback on failure
- Configurable update parameters

## 🎯 **Best Practices**

### **1. Image Tagging Strategy**
- Use semantic versioning (v1.0.0, v1.1.0, etc.)
- Always tag with `latest` for easy reference
- Use commit SHAs for debugging specific builds

### **2. Resource Management**
- Set appropriate resource requests and limits
- Monitor resource usage with metrics server
- Use horizontal pod autoscaling (HPA) for dynamic scaling

### **3. Security**
- Use secrets for sensitive data
- Implement network policies
- Regular security updates
- Image vulnerability scanning

### **4. Monitoring**
- Use Prometheus + Grafana for metrics
- Implement proper logging (ELK stack)
- Set up alerts for critical issues
- Monitor application health endpoints

## 🔄 **CI/CD Integration**

### **1. Automatic Deployment (Optional)**

If you want automatic deployment after successful builds:

```yaml
# Add to .gitlab-ci.yml
deploy:k8s:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl config use-context $KUBE_CONTEXT
    - kubectl set image deployment/fashionhub-app \
        fashionhub=$CI_REGISTRY_IMAGE/fashionhub:$CI_COMMIT_TAG \
        -n fashionhub
    - kubectl rollout status deployment/fashionhub-app -n fashionhub
  only:
    - tags
  environment:
    name: production
    url: https://fashionhub.yourdomain.com
```

### **2. Environment Variables for K8s**

Set these in GitLab CI/CD Variables:
- `KUBE_CONTEXT` - Kubernetes context name
- `KUBE_CONFIG` - Base64 encoded kubeconfig

## 🗄️ **VM Database Services**

### **PostgreSQL Database**
- **Already running on the VM** (not in Kubernetes)
- **Host**: `localhost` (from container perspective)
- **Port**: 5432
- **Database**: fashionhub_db
- **User**: fashionhub_user
- **Password**: Stored in Kubernetes secrets

### **Redis Instance**
- **Already running on the VM** (not in Kubernetes)
- **Host**: `localhost` (from container perspective)
- **Port**: 6379
- **Password**: Stored in Kubernetes secrets

### **Connection Details**
The application automatically connects to:
- `DATABASE_URL`: `postgresql://fashionhub_user:password@localhost:5432/fashionhub_db`
- `REDIS_URL`: `redis://:password@localhost:6379`

## 📚 **Additional Resources**

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [GitLab Container Registry](https://docs.gitlab.com/ee/user/packages/container_registry/)
- [Helm Charts](https://helm.sh/docs/)
- [Kubernetes Best Practices](https://kubernetes.io/docs/concepts/configuration/overview/)

---

**Note**: 
- Replace `YOUR_USERNAME`, `YOUR_PROJECT`, and `YOUR_DOMAIN` with your actual values
- PostgreSQL and Redis are already running on the VM, not in Kubernetes
- Adjust resource limits and replica counts based on your cluster capacity
- The single image contains both frontend and backend services
