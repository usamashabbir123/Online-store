# FashionHub Backend API

A secure, scalable, and feature-rich Node.js backend for the FashionHub e-commerce platform.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens, role-based access control
- **User Management**: Customer, seller, and admin user types with comprehensive profiles
- **Store Management**: Multi-vendor marketplace support with store approval workflows
- **Product Management**: Advanced product catalog with variants, categories, and inventory
- **Order Processing**: Complete order lifecycle with status tracking
- **Payment Integration**: Stripe payment processing with webhook support
- **File Management**: Secure file uploads with image processing and optimization
- **Admin Dashboard**: Comprehensive admin tools for platform management
- **Security**: Rate limiting, CORS, Helmet, input validation, and more

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0 with Prisma ORM
- **Authentication**: JWT + Refresh Tokens
- **Password Hashing**: bcryptjs
- **File Uploads**: Multer + Sharp
- **Payments**: Stripe
- **Caching**: Redis (optional)
- **Email**: SendGrid/Resend (conceptual)
- **File Storage**: Local + AWS S3 (conceptual)
- **Search**: Elasticsearch (conceptual)

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- Redis (optional, for caching)
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## 🗄️ Database Schema

The application uses MySQL with the following key entities:

- **Users**: Customer, seller, and admin accounts
- **Stores**: Multi-vendor marketplace stores
- **Products**: Product catalog with variants
- **Orders**: Order management and tracking
- **Payments**: Payment processing and history
- **Addresses**: User shipping and billing addresses
- **Reviews**: Product ratings and feedback

## 🔐 Authentication

### JWT Tokens
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal

### Protected Routes
Most routes require authentication via Bearer token:
```
Authorization: Bearer <access_token>
```

### Role-Based Access
- **Customer**: View products, manage cart, place orders
- **Seller**: Manage store, products, and orders
- **Admin**: Full platform access and management

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Add new address
- `GET /api/users/cart` - Get shopping cart
- `POST /api/users/cart` - Add to cart

### Products
- `GET /api/products` - List products with filtering
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Payments
- `POST /api/payments/intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/stores` - List all stores
- `PUT /api/admin/stores/:id/approve` - Approve store
- `GET /api/admin/users` - List all users
- `GET /api/admin/orders` - List all orders

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3001` |
| `DATABASE_URL` | MySQL connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - |
| `REDIS_URL` | Redis connection string | - |
| `STRIPE_SECRET_KEY` | Stripe secret key | - |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## 🐳 Docker Deployment

### Development with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker

```bash
# Build image
docker build -t fashionhub-backend .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL="mysql://user:pass@host:3306/db" \
  -e JWT_SECRET="your-secret" \
  fashionhub-backend
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── middleware/      # Custom middleware
│   ├── lib/            # Database and utility functions
│   └── scripts/        # Database seeding and utilities
├── prisma/             # Database schema and migrations
├── uploads/            # File upload directory
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Development environment
└── package.json        # Dependencies and scripts
```

## 🚀 Development

### Code Style
- Use ES6+ features
- Follow Express.js best practices
- Implement proper error handling
- Use async/await for database operations

### Adding New Features
1. Update Prisma schema if needed
2. Create new route handlers
3. Add validation middleware
4. Update tests
5. Update documentation

### Database Migrations
```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Prevent abuse and DDoS
- **Input Validation**: Sanitize all user inputs
- **CORS Protection**: Control cross-origin requests
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with configurable rounds
- **SQL Injection Protection**: Prisma ORM with parameterized queries

## 📊 Monitoring & Logging

- **Morgan**: HTTP request logging
- **Error Tracking**: Centralized error handling
- **Health Checks**: `/health` endpoint for monitoring
- **Structured Logging**: JSON format for production

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify connection string in `.env`
   - Ensure database exists

2. **JWT Token Issues**
   - Check JWT secrets in `.env`
   - Verify token expiration times
   - Check token format in requests

3. **File Upload Errors**
   - Verify upload directory permissions
   - Check file size limits
   - Ensure allowed file types

### Getting Help

- Check the logs: `docker-compose logs -f`
- Verify environment variables
- Test database connection
- Check Prisma client generation

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**FashionHub Backend** - Built with ❤️ for modern e-commerce
