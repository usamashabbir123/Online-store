# FashionHub Production Deployment Guide

This guide provides step-by-step instructions for deploying FashionHub to production using the new JSON-based configuration system.

## 🎯 **Overview**

- **Single Docker Image**: Contains both frontend and backend
- **External Databases**: PostgreSQL and Redis running on VM
- **JSON Configuration**: Separate configs for development and production
- **Environment Variables**: Secure configuration management

## 📋 **Prerequisites**

### **VM Requirements**
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 50GB+ available space
- **Network**: Public IP with ports 80, 443, 3000, 5000 open

### **Software Requirements**
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **PostgreSQL**: 13+
- **Redis**: 6+
- **Nginx**: For reverse proxy (optional)

## 🗄️ **Database Setup**

### **1. Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# CentOS/RHEL
sudo yum install postgresql-server postgresql-contrib
sudo postgresql-setup initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### **2. Configure PostgreSQL**

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE fashionhub_db;
CREATE USER fashionhub_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE fashionhub_db TO fashionhub_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO fashionhub_user;
ALTER USER fashionhub_user CREATEDB;

# Exit PostgreSQL
\q
```

### **3. Configure PostgreSQL for External Connections**

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/13/main/postgresql.conf
# Add: listen_addresses = '*'

sudo nano /etc/postgresql/13/main/pg_hba.conf
# Add: host    all             all             0.0.0.0/0               md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### **4. Install and Configure Redis**

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis with password
sudo nano /etc/redis/redis.conf
# Add: requirepass your_redis_password

# Restart Redis
sudo systemctl restart redis
sudo systemctl enable redis
```

## 🐳 **Docker Setup**

### **1. Install Docker**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **2. Create Application Directory**

```bash
# Create application directory
sudo mkdir -p /opt/fashionhub
sudo chown $USER:$USER /opt/fashionhub
cd /opt/fashionhub
```

## ⚙️ **Configuration Setup**

### **1. Environment Variables**

```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

**Required Environment Variables:**
```bash
# Database
POSTGRES_PASSWORD=your_secure_postgres_password
REDIS_PASSWORD=your_secure_redis_password

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_long_and_random

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_email_app_password

# Payment Gateways (optional)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

### **2. Configuration Files**

The application uses two configuration files:
- **`config/config.json`**: Local development settings
- **`config/config.json.template`**: Production template with environment variables

## 🚀 **Deployment Options**

### **Option 1: Docker Run (Simple)**

```bash
# Pull the image from GitLab registry
docker pull registry.gitlab.com/your-username/your-project/fashionhub:latest

# Run the container
docker run -d \
  --name fashionhub \
  --restart unless-stopped \
  -p 3000:3000 \
  -p 5000:5000 \
  --env-file .env \
  -v /opt/fashionhub/uploads:/app/uploads \
  -v /opt/fashionhub/logs:/app/logs \
  registry.gitlab.com/your-username/your-project/fashionhub:latest
```

### **Option 2: Docker Compose (Recommended)**

```yaml
# docker-compose.yml
version: '3.8'

services:
  fashionhub:
    image: registry.gitlab.com/your-username/your-project/fashionhub:latest
    container_name: fashionhub
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "5000:5000"
    env_file:
      - .env
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  uploads:
  logs:
```

```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### **Option 3: Kubernetes Deployment**

```bash
# Create namespace
kubectl create namespace fashionhub

# Create secrets
kubectl create secret generic fashionhub-secrets \
  --from-literal=postgres-password=your_password \
  --from-literal=redis-password=your_password \
  --from-literal=jwt-secret=your_jwt_secret \
  -n fashionhub

# Apply deployment
kubectl apply -f k8s/fashionhub-deployment.yaml -n fashionhub
```

## 🔧 **Application Setup**

### **1. Database Migration**

```bash
# Run database migrations
docker exec fashionhub npx prisma migrate deploy

# Seed the database
docker exec fashionhub npx prisma db seed
```

### **2. Verify Deployment**

```bash
# Check application health
curl http://localhost:5000/health

# Check frontend
curl http://localhost:3000

# View logs
docker logs fashionhub
```

## 🌐 **Reverse Proxy Setup (Optional)**

### **Nginx Configuration**

```nginx
# /etc/nginx/sites-available/fashionhub
server {
    listen 80;
    server_name fashionhub.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/fashionhub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 **Security Hardening**

### **1. Firewall Configuration**

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp
sudo ufw enable
```

### **2. SSL Certificate (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d fashionhub.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 **Monitoring and Logging**

### **1. Application Logs**

```bash
# View application logs
docker logs -f fashionhub

# View logs from host
tail -f /opt/fashionhub/logs/app.log
```

### **2. Database Monitoring**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check Redis status
sudo systemctl status redis

# Monitor database connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

### **3. System Monitoring**

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor system resources
htop
iotop
nethogs
```

## 🔄 **Updates and Maintenance**

### **1. Application Updates**

```bash
# Pull new image
docker pull registry.gitlab.com/your-username/your-project/fashionhub:latest

# Stop current container
docker stop fashionhub

# Remove old container
docker rm fashionhub

# Start new container
docker run -d \
  --name fashionhub \
  --restart unless-stopped \
  -p 3000:3000 \
  -p 5000:5000 \
  --env-file .env \
  -v /opt/fashionhub/uploads:/app/uploads \
  -v /opt/fashionhub/logs:/app/logs \
  registry.gitlab.com/your-username/your-project/fashionhub:latest
```

### **2. Database Backups**

```bash
# Create backup script
cat > /opt/fashionhub/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/opt/fashionhub/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
sudo -u postgres pg_dump fashionhub_db > $BACKUP_DIR/fashionhub_db_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/fashionhub_db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

chmod +x /opt/fashionhub/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /opt/fashionhub/backup.sh
```

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Database Connection Failed**
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Check connection
   psql -h localhost -U fashionhub_user -d fashionhub_db
   ```

2. **Redis Connection Failed**
   ```bash
   # Check Redis status
   sudo systemctl status redis
   
   # Test Redis connection
   redis-cli -a your_redis_password ping
   ```

3. **Application Won't Start**
   ```bash
   # Check container logs
   docker logs fashionhub
   
   # Check environment variables
   docker exec fashionhub env | grep -E "(POSTGRES|REDIS|JWT)"
   ```

4. **Port Already in Use**
   ```bash
   # Check port usage
   sudo netstat -tlnp | grep :5000
   sudo netstat -tlnp | grep :3000
   
   # Kill process if needed
   sudo kill -9 <PID>
   ```

## 📚 **Additional Resources**

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Note**: This guide assumes a production environment with proper security measures. Always test in a staging environment first and ensure all security best practices are followed.
