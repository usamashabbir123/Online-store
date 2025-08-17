#!/bin/bash

# FashionHub Kubernetes Deployment Script
# This script deploys the complete FashionHub application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="fashionhub"
REGISTRY_SECRET="gitlab-registry"
IMAGE_NAME="registry.gitlab.com/YOUR_USERNAME/YOUR_PROJECT/fashionhub:latest"

echo -e "${BLUE}🚀 FashionHub Kubernetes Deployment${NC}"
echo "=================================="

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    print_error "kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    print_error "kubectl is not configured. Please configure your cluster access."
    exit 1
fi

print_status "Kubernetes cluster connection verified"

# Create namespace
echo -e "\n${BLUE}📦 Creating namespace...${NC}"
kubectl apply -f namespace.yaml
print_status "Namespace created"

# Create registry secret (if not exists)
echo -e "\n${BLUE}🔐 Creating registry secret...${NC}"
if ! kubectl get secret $REGISTRY_SECRET -n $NAMESPACE &> /dev/null; then
    echo "Please create the GitLab registry secret manually:"
    echo "kubectl create secret docker-registry $REGISTRY_SECRET \\"
    echo "  --docker-server=registry.gitlab.com \\"
    echo "  --docker-username=YOUR_USERNAME \\"
    echo "  --docker-password=YOUR_ACCESS_TOKEN \\"
    echo "  --docker-email=YOUR_EMAIL \\"
    echo "  -n $NAMESPACE"
    read -p "Press Enter after creating the secret..."
else
    print_status "Registry secret already exists"
fi

# Create secrets
echo -e "\n${BLUE}🔐 Creating secrets...${NC}"
print_warning "Please update secrets.yaml with your actual base64-encoded values before proceeding"
read -p "Press Enter after updating secrets.yaml..."

kubectl apply -f secrets.yaml
print_status "Secrets created"

# Create ConfigMap
echo -e "\n${BLUE}⚙️  Creating ConfigMap...${NC}"
kubectl apply -f configmap.yaml
print_status "ConfigMap created"

# Create Persistent Volume Claims
echo -e "\n${BLUE}💾 Creating Persistent Volume Claims...${NC}"
kubectl apply -f persistent-volumes.yaml
print_status "PVCs created"

# Wait for PVCs to be bound
echo -e "\n${BLUE}⏳ Waiting for PVCs to be bound...${NC}"
kubectl wait --for=condition=Bound pvc/fashionhub-uploads-pvc -n $NAMESPACE --timeout=300s
kubectl wait --for=condition=Bound pvc/fashionhub-logs-pvc -n $NAMESPACE --timeout=300s
print_status "PVCs are bound"

# Create deployment
echo -e "\n${BLUE}🚀 Creating deployment...${NC}"
print_warning "Please update deployment.yaml with your actual image name before proceeding"
read -p "Press Enter after updating deployment.yaml..."

kubectl apply -f deployment.yaml
print_status "Deployment created"

# Wait for deployment to be ready
echo -e "\n${BLUE}⏳ Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available deployment/fashionhub-app -n $NAMESPACE --timeout=600s
print_status "Deployment is ready"

# Create services
echo -e "\n${BLUE}🌐 Creating services...${NC}"
kubectl apply -f services.yaml
print_status "Services created"

# Create network policy
echo -e "\n${BLUE}🔒 Creating network policy...${NC}"
kubectl apply -f network-policy.yaml
print_status "Network policy created"

# Create HPA
echo -e "\n${BLUE}📈 Creating Horizontal Pod Autoscaler...${NC}"
kubectl apply -f hpa.yaml
print_status "HPA created"

# Create ingress
echo -e "\n${BLUE}🌍 Creating ingress...${NC}"
print_warning "Please update ingress.yaml with your actual domain name before proceeding"
read -p "Press Enter after updating ingress.yaml..."

kubectl apply -f ingress.yaml
print_status "Ingress created"

# Show deployment status
echo -e "\n${BLUE}📊 Deployment Status:${NC}"
echo "========================"

echo -e "\n${YELLOW}Pods:${NC}"
kubectl get pods -n $NAMESPACE

echo -e "\n${YELLOW}Services:${NC}"
kubectl get services -n $NAMESPACE

echo -e "\n${YELLOW}Ingress:${NC}"
kubectl get ingress -n $NAMESPACE

echo -e "\n${YELLOW}PVCs:${NC}"
kubectl get pvc -n $NAMESPACE

echo -e "\n${YELLOW}HPA:${NC}"
kubectl get hpa -n $NAMESPACE

# Show useful commands
echo -e "\n${BLUE}🔧 Useful Commands:${NC}"
echo "=================="
echo "View logs: kubectl logs -f deployment/fashionhub-app -n $NAMESPACE"
echo "Port forward: kubectl port-forward service/fashionhub-frontend-service 3000:80 -n $NAMESPACE"
echo "Port forward backend: kubectl port-forward service/fashionhub-backend-service 5000:80 -n $NAMESPACE"
echo "Scale deployment: kubectl scale deployment/fashionhub-app --replicas=5 -n $NAMESPACE"
echo "Update image: kubectl set image deployment/fashionhub-app fashionhub=$IMAGE_NAME -n $NAMESPACE"

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. Update your DNS to point to your cluster's ingress IP"
echo "2. Configure SSL certificates (if using cert-manager)"
echo "3. Set up monitoring and logging"
echo "4. Configure database backups"
