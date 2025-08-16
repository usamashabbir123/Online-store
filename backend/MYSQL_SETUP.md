# MySQL Setup Guide for FashionHub Backend

This guide will help you set up MySQL for the FashionHub backend application.

## 🗄️ Prerequisites

- MySQL 8.0 or higher installed
- MySQL client tools (mysql command line or MySQL Workbench)
- Node.js 18+ and npm

## 🚀 Quick Setup with Docker (Recommended)

The easiest way to get started is using Docker Compose:

```bash
# Start MySQL and other services
docker-compose up -d

# Check if services are running
docker-compose ps

# View MySQL logs
docker-compose logs mysql
```

## 🔧 Manual MySQL Setup

### 1. Install MySQL

#### Windows
```bash
# Download MySQL Installer from https://dev.mysql.com/downloads/installer/
# Run the installer and follow the setup wizard
```

#### macOS
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2. Secure MySQL Installation

```bash
# Run security script (Linux/macOS)
sudo mysql_secure_installation

# Or connect as root and set password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_root_password';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Create Database and User

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE fashionhub_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'fashionhub_user'@'localhost' IDENTIFIED BY 'fashionhub_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON fashionhub_db.* TO 'fashionhub_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT User, Host FROM mysql.user;
```

### 4. Test Connection

```bash
# Test connection with the new user
mysql -u fashionhub_user -p fashionhub_db

# You should see the MySQL prompt
mysql>
```

## ⚙️ Environment Configuration

### 1. Copy Environment Template

```bash
cp env.example .env
```

### 2. Update Database URL

Edit `.env` file and update the DATABASE_URL:

```env
# For local MySQL
DATABASE_URL="mysql://fashionhub_user:fashionhub_password@localhost:3306/fashionhub_db"

# For Docker MySQL
DATABASE_URL="mysql://fashionhub_user:fashionhub_password@localhost:3306/fashionhub_db"
```

## 🗃️ Database Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate Prisma Client

```bash
npm run db:generate
```

### 3. Run Database Migrations

```bash
npm run db:migrate
```

### 4. Seed Database (Optional)

```bash
npm run db:seed
```

## 🔍 Verify Setup

### 1. Check Database Tables

```sql
USE fashionhub_db;
SHOW TABLES;
```

You should see tables like:
- users
- user_profiles
- addresses
- stores
- products
- orders
- payments
- cart_items
- wishlist_items
- reviews
- refresh_tokens

### 2. Test API Connection

```bash
# Start the backend server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:3001/health
```

## 🐳 Docker Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f mysql
docker-compose logs -f backend
```

### Reset Database
```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: This will delete all data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL service is running
   - Verify port 3306 is not blocked
   - Check firewall settings

2. **Access Denied**
   - Verify username and password
   - Check user privileges
   - Ensure user can connect from your host

3. **Character Set Issues**
   - Ensure database uses utf8mb4
   - Check MySQL configuration file

4. **Prisma Errors**
   - Run `npm run db:generate` after schema changes
   - Check DATABASE_URL format
   - Verify database exists

### Useful Commands

```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL version
mysql --version

# Check running processes
sudo netstat -tlnp | grep 3306

# Reset MySQL root password (if needed)
sudo mysqld_safe --skip-grant-tables &
mysql -u root
UPDATE mysql.user SET authentication_string=PASSWORD('new_password') WHERE User='root';
FLUSH PRIVILEGES;
```

## 📊 Performance Tips

1. **Indexes**: Prisma will create necessary indexes automatically
2. **Connection Pool**: Prisma handles connection pooling
3. **Query Optimization**: Use Prisma's query optimization features
4. **Monitoring**: Use MySQL Workbench or similar tools for monitoring

## 🔒 Security Best Practices

1. **Strong Passwords**: Use complex passwords for database users
2. **Limited Privileges**: Only grant necessary privileges to application users
3. **Network Security**: Restrict database access to application servers only
4. **Regular Updates**: Keep MySQL updated with security patches
5. **Backup Strategy**: Implement regular database backups

## 📚 Additional Resources

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [Prisma MySQL Documentation](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

**Note**: This guide assumes you're using MySQL 8.0. If you're using a different version, some commands may vary slightly.
