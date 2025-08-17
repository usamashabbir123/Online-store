#!/bin/bash

# FashionHub Kubernetes Secrets Generator
# This script helps generate base64-encoded secrets for Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 FashionHub Kubernetes Secrets Generator${NC}"
echo "=============================================="

# Function to generate base64 encoded value
generate_secret() {
    local key=$1
    local prompt=$2
    local default=$3
    
    echo -e "\n${YELLOW}$prompt${NC}"
    if [ -n "$default" ]; then
        echo -e "${BLUE}Default: $default${NC}"
    fi
    
    read -p "Enter value: " value
    
    if [ -z "$value" ] && [ -n "$default" ]; then
        value=$default
    fi
    
    if [ -n "$value" ]; then
        encoded=$(echo -n "$value" | base64)
        echo "  $key: $encoded"
    else
        echo -e "${RED}Value cannot be empty${NC}"
        exit 1
    fi
}

echo -e "\n${GREEN}Generating base64-encoded secrets...${NC}"

# Database Configuration
generate_secret "postgres-password" "PostgreSQL Password" "your_secure_postgres_password"
generate_secret "redis-password" "Redis Password" "your_secure_redis_password"

# Authentication
generate_secret "jwt-secret" "JWT Secret Key" "your_super_secret_jwt_key_here_make_it_long_and_random"
generate_secret "jwt-refresh-secret" "JWT Refresh Secret Key" "your_super_secret_refresh_jwt_key_here_make_it_long_and_random"

# Email Configuration
generate_secret "smtp-host" "SMTP Host" "smtp.gmail.com"
generate_secret "smtp-username" "SMTP Username" "your_email@gmail.com"
generate_secret "smtp-password" "SMTP Password" "your_email_app_password"

# Payment Gateway - Stripe
generate_secret "stripe-secret-key" "Stripe Secret Key" "sk_test_your_stripe_secret_key"
generate_secret "stripe-publishable-key" "Stripe Publishable Key" "pk_test_your_stripe_publishable_key"
generate_secret "stripe-webhook-secret" "Stripe Webhook Secret" "whsec_your_stripe_webhook_secret"

# Payment Gateway - PayPal
generate_secret "paypal-client-id" "PayPal Client ID" "your_paypal_client_id"
generate_secret "paypal-client-secret" "PayPal Client Secret" "your_paypal_client_secret"

echo -e "\n${GREEN}✅ Secrets generation completed!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Copy the generated values above"
echo "2. Update the secrets.yaml file with these values"
echo "3. Run the deployment script: ./deploy.sh"
