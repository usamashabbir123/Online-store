# MarketHub Backend Architecture

## System Overview

MarketHub is a multi-actor e-commerce platform supporting three user types:
- **Customers**: Browse and purchase products
- **Sellers**: Create stores, manage products, fulfill orders
- **Admins**: Approve stores, manage platform, moderate content

## Architecture Diagram

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Services      │
                    │                 │
                    │ • Auth Service  │
                    │ • Email Service │
                    │ • File Service  │
                    │ • Payment Svc   │
                    └─────────────────┘
\`\`\`

## Technology Stack

### Core Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma or Drizzle ORM
- **Authentication**: JWT + Refresh Tokens
- **File Storage**: AWS S3 or Vercel Blob
- **Email**: SendGrid or Resend
- **Payments**: Stripe

### Infrastructure
- **Hosting**: Vercel or AWS
- **CDN**: Cloudflare or AWS CloudFront
- **Monitoring**: Sentry + DataDog
- **Caching**: Redis (optional)

## Database Schema

### Core Tables

#### Users
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  status user_status NOT NULL DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
\`\`\`

#### Stores
\`\`\`sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  status store_status NOT NULL DEFAULT 'pending',
  category VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  setup_fee_paid BOOLEAN DEFAULT FALSE,
  setup_fee_amount DECIMAL(10,2) DEFAULT 299.00,
  commission_rate DECIMAL(5,4) DEFAULT 0.05,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE store_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
\`\`\`

#### Products
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  track_quantity BOOLEAN DEFAULT TRUE,
  status product_status DEFAULT 'active',
  category VARCHAR(100),
  brand VARCHAR(100),
  weight DECIMAL(8,3),
  dimensions JSONB, -- {length, width, height}
  images JSONB, -- array of image URLs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(store_id, slug)
);

CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');
\`\`\`

#### Orders
\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id),
  store_id UUID NOT NULL REFERENCES stores(id),
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  commission_amount DECIMAL(10,2) NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
\`\`\`

#### Order Items
\`\`\`sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_snapshot JSONB NOT NULL -- store product details at time of order
);
\`\`\`

### Additional Tables

#### Store Applications
\`\`\`sql
CREATE TABLE store_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  business_name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  tax_id VARCHAR(100),
  phone VARCHAR(50),
  address TEXT,
  documents JSONB, -- array of document URLs
  bank_account JSONB, -- encrypted bank details
  status application_status DEFAULT 'pending',
  admin_notes TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id)
);

CREATE TYPE application_status AS ENUM ('pending', 'approved', 'rejected');
\`\`\`

#### Reviews
\`\`\`sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  customer_id UUID NOT NULL REFERENCES users(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT TRUE,
  status review_status DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, customer_id, order_id)
);

CREATE TYPE review_status AS ENUM ('pending', 'published', 'hidden');
\`\`\`

## API Routes

### Authentication Routes
\`\`\`
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh JWT token
POST   /api/auth/forgot-password   # Password reset request
POST   /api/auth/reset-password    # Password reset confirmation
GET    /api/auth/verify-email      # Email verification
\`\`\`

### User Management
\`\`\`
GET    /api/users/profile          # Get current user profile
PUT    /api/users/profile          # Update user profile
DELETE /api/users/account          # Delete user account
GET    /api/users/:id              # Get user by ID (admin only)
GET    /api/users                  # List users (admin only)
PUT    /api/users/:id/status       # Update user status (admin only)
\`\`\`

### Store Management
\`\`\`
POST   /api/stores/apply           # Submit store application
GET    /api/stores/application     # Get application status
PUT    /api/stores/application     # Update application

GET    /api/stores/:id             # Get store details
PUT    /api/stores/:id             # Update store (owner only)
GET    /api/stores/:id/products    # Get store products
GET    /api/stores/:id/orders      # Get store orders (owner only)
GET    /api/stores/:id/analytics   # Get store analytics (owner only)

# Admin routes
GET    /api/admin/stores           # List all stores
PUT    /api/admin/stores/:id/approve    # Approve store
PUT    /api/admin/stores/:id/reject     # Reject store
\`\`\`

### Product Management
\`\`\`
GET    /api/products               # List products (with filters)
GET    /api/products/:id           # Get product details
POST   /api/products               # Create product (seller only)
PUT    /api/products/:id           # Update product (seller only)
DELETE /api/products/:id           # Delete product (seller only)
POST   /api/products/:id/images    # Upload product images
\`\`\`

### Order Management
\`\`\`
POST   /api/orders                 # Create order
GET    /api/orders                 # List user orders
GET    /api/orders/:id             # Get order details
PUT    /api/orders/:id/status      # Update order status (seller only)
POST   /api/orders/:id/cancel      # Cancel order
POST   /api/orders/:id/refund      # Process refund (admin only)
\`\`\`

### Payment Processing
\`\`\`
POST   /api/payments/intent        # Create payment intent
POST   /api/payments/confirm       # Confirm payment
POST   /api/payments/webhook       # Stripe webhook
GET    /api/payments/methods       # Get saved payment methods
POST   /api/payments/methods       # Save payment method
\`\`\`

### File Upload
\`\`\`
POST   /api/upload/image           # Upload single image
POST   /api/upload/images          # Upload multiple images
POST   /api/upload/document        # Upload document
DELETE /api/upload/:id             # Delete uploaded file
\`\`\`

## Authentication & Authorization

### JWT Token Structure
\`\`\`json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "customer|seller|admin",
  "store_id": "store_id", // if seller
  "iat": 1234567890,
  "exp": 1234567890
}
\`\`\`

### Role-Based Access Control

#### Customer Permissions
- Browse products and stores
- Place orders
- Manage profile
- Leave reviews

#### Seller Permissions
- All customer permissions
- Manage own store
- Manage own products
- View own orders and analytics
- Respond to customer messages

#### Admin Permissions
- All seller permissions
- Approve/reject store applications
- Manage all users and stores
- View platform analytics
- Moderate content

### Middleware Implementation
\`\`\`javascript
// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
const requireRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  next();
};

// Store ownership verification
const requireStoreOwnership = async (req, res, next) => {
  const storeId = req.params.storeId || req.body.store_id;
  const store = await Store.findById(storeId);
  
  if (!store || store.owner_id !== req.user.sub) {
    return res.status(403).json({ error: 'Store access denied' });
  }
  next();
};
\`\`\`

## Payment Processing Flow

### Store Application Payment
1. User submits store application
2. Frontend creates Stripe Payment Intent for $299
3. User completes payment
4. Webhook confirms payment
5. Application status updated to "payment_completed"
6. Admin can now approve/reject application

### Order Payment Flow
1. Customer adds items to cart
2. Frontend creates order with "pending" status
3. Create Stripe Payment Intent for order total
4. Customer completes payment
5. Webhook confirms payment
6. Order status updated to "confirmed"
7. Commission calculated and tracked
8. Seller receives payout (minus commission)

### Stripe Webhook Events
\`\`\`javascript
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
};
\`\`\`

## Email Notifications

### Email Templates Needed
- Welcome email (user registration)
- Email verification
- Password reset
- Store application received
- Store approved/rejected
- New order (seller notification)
- Order status updates (customer)
- Payment confirmations
- Weekly sales reports (sellers)

### Email Service Implementation
\`\`\`javascript
const emailService = {
  async sendWelcomeEmail(user) {
    await sendEmail({
      to: user.email,
      template: 'welcome',
      data: { firstName: user.first_name }
    });
  },
  
  async sendOrderConfirmation(order, customer) {
    await sendEmail({
      to: customer.email,
      template: 'order-confirmation',
      data: { order, customer }
    });
  },
  
  async sendStoreApproval(store, owner) {
    await sendEmail({
      to: owner.email,
      template: 'store-approved',
      data: { store, owner }
    });
  }
};
\`\`\`

## File Storage Strategy

### Image Processing Pipeline
1. User uploads image
2. Validate file type and size
3. Generate unique filename
4. Upload to cloud storage (S3/Vercel Blob)
5. Create multiple sizes (thumbnail, medium, large)
6. Return URLs for all sizes

### File Organization
\`\`\`
/uploads/
  /users/
    /{user_id}/
      /avatar/
  /stores/
    /{store_id}/
      /logo/
      /banner/
  /products/
    /{product_id}/
      /images/
  /documents/
    /{user_id}/
      /business_license.pdf
      /tax_certificate.pdf
\`\`\`

## Security Considerations

### Data Protection
- Hash passwords with bcrypt (12+ rounds)
- Encrypt sensitive data (bank details, SSN)
- Use HTTPS everywhere
- Implement rate limiting
- Validate and sanitize all inputs
- Use parameterized queries (prevent SQL injection)

### API Security
- JWT tokens with short expiration
- Refresh token rotation
- CORS configuration
- Request size limits
- File upload restrictions
- IP-based rate limiting for sensitive endpoints

### PCI Compliance
- Never store credit card details
- Use Stripe for all payment processing
- Implement proper webhook signature verification
- Log all payment-related activities

## Performance Optimization

### Database Optimization
\`\`\`sql
-- Essential indexes
CREATE INDEX idx_products_store_status ON products(store_id, status);
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at);
CREATE INDEX idx_orders_store_status ON orders(store_id, status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_products_category_status ON products(category, status);
\`\`\`

### Caching Strategy
- Redis for session storage
- Cache product listings (5-minute TTL)
- Cache store profiles (15-minute TTL)
- Cache user permissions (1-hour TTL)

### API Response Optimization
- Implement pagination for all list endpoints
- Use field selection (GraphQL-style)
- Compress responses with gzip
- Implement ETag headers for caching

## Monitoring & Logging

### Key Metrics to Track
- API response times
- Database query performance
- Payment success/failure rates
- User registration/conversion rates
- Store approval rates
- Order completion rates

### Error Tracking
- Use Sentry for error monitoring
- Log all payment failures
- Track failed login attempts
- Monitor file upload failures

### Business Metrics
- Daily/monthly active users
- Revenue and commission tracking
- Top-performing stores and products
- Customer acquisition costs

## Deployment Architecture

### Environment Configuration
\`\`\`
# Development
DATABASE_URL=postgresql://localhost:5432/markethub_dev
JWT_SECRET=dev_secret_key
STRIPE_SECRET_KEY=sk_test_...

# Production
DATABASE_URL=postgresql://prod_host:5432/markethub_prod
JWT_SECRET=secure_production_secret
STRIPE_SECRET_KEY=sk_live_...
\`\`\`

### CI/CD Pipeline
1. Code pushed to repository
2. Run tests and linting
3. Build Docker image
4. Deploy to staging environment
5. Run integration tests
6. Deploy to production (with approval)
7. Run smoke tests

This architecture provides a solid foundation for building a scalable, secure multi-vendor marketplace platform.
