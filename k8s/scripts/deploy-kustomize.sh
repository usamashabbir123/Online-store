#!/bin/bash

# FashionHub Kustomize Deployment Script
# This script deploys the FashionHub application using Kustomize

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
NAMESPACE="fashionhub"
if [ "$ENVIRONMENT" = "development" ]; then
    NAMESPACE="fashionhub-dev"
elif [ "$ENVIRONMENT" = "staging" ]; then
    NAMESPACE="fashionhub-staging"
fi

echo -e "${BLUE}🚀 FashionHub Kustomize Deployment${NC}"
echo "====================================="
echo -e "${YELLOW}Environment: $ENVIRONMENT${NC}"
echo -e "${YELLOW}Namespace: $NAMESPACE${NC}"

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

# Check if kustomize is installed
if ! command -v kustomize &> /dev/null; then
    print_warning "kustomize is not installed. Installing..."
    curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
    sudo mv kustomize /usr/local/bin/
fi

# Check if kubectl is configured
if ! kubectl cluster-info &> /dev/null; then
    print_error "kubectl is not configured. Please configure your cluster access."
    exit 1
fi

print_status "Kubernetes cluster connection verified"

# Deploy using Kustomize
echo -e "\n${BLUE}📦 Deploying FashionHub to $ENVIRONMENT environment...${NC}"

# Build and apply using Kustomize
kustomize build k8s/overlays/$ENVIRONMENT | kubectl apply -f -

print_status "Deployment applied successfully"

# Wait for deployment to be ready
echo -e "\n${BLUE}⏳ Waiting for deployment to be ready...${NC}"
kubectl wait --for=condition=available deployment/fashionhub-app -n $NAMESPACE --timeout=600s
print_status "Deployment is ready"

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
echo "Update image: kubectl set image deployment/fashionhub-app fashionhub=registry.gitlab.com/username/project/fashionhub:v1.1.0 -n $NAMESPACE"

echo -e "\n${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${YELLOW}Don't forget to:${NC}"
echo "1. Update your DNS to point to your cluster's ingress IP"
echo "2. Configure SSL certificates (if using cert-manager)"
echo "3. Set up monitoring and logging"
echo "4. Configure database backups"
