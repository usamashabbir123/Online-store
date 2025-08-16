# FashionHub Backend Architecture

## System Overview

FashionHub is a direct retail clothing e-commerce platform supporting two user types:
- **Customers**: Browse and purchase premium clothing items for men, women, and children
- **Admins**: Manage inventory, process orders, oversee platform operations

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
                    │ • Inventory Svc │
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
- **Search**: Elasticsearch (for product search)

### Infrastructure
- **Hosting**: Vercel or AWS
- **CDN**: Cloudflare or AWS CloudFront
- **Monitoring**: Sentry + DataDog
- **Caching**: Redis
- **Analytics**: Google Analytics + Custom Dashboard

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
  phone VARCHAR(50),
  date_of_birth DATE,
  preferences JSONB, -- style preferences, size preferences
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('customer', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
\`\`\`

#### Products (Direct Retail Clothing)
\`\`\`sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku VARCHAR(100) UNIQUE,
  
  -- Clothing-specific fields
  category clothing_category NOT NULL,
  subcategory VARCHAR(100),
  gender gender_type NOT NULL,
  age_group age_group_type NOT NULL,
  brand VARCHAR(100) NOT NULL DEFAULT 'FashionHub',
  material VARCHAR(255),
  care_instructions TEXT,
  country_of_origin VARCHAR(100),
  
  -- Inventory management
  has_variants BOOLEAN DEFAULT TRUE,
  track_quantity BOOLEAN DEFAULT TRUE,
  status product_status DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  
  -- SEO and display
  images JSONB NOT NULL, -- array of image URLs
  size_chart_url VARCHAR(500),
  model_measurements JSONB,
  tags TEXT[], -- for search and filtering
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE clothing_category AS ENUM (
  'tops', 'bottoms', 'dresses', 'outerwear', 'underwear', 
  'sleepwear', 'activewear', 'swimwear', 'shoes', 'accessories',
  'suits', 'formal_wear', 'uniforms'
);

CREATE TYPE gender_type AS ENUM ('men', 'women', 'unisex');
CREATE TYPE age_group_type AS ENUM ('adult', 'teen', 'child', 'toddler', 'baby');
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived', 'out_of_stock');
\`\`\`

#### Product Variants (Sizes & Colors)
\`\`\`sql
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE,
  size VARCHAR(20) NOT NULL,
  color VARCHAR(50) NOT NULL,
  color_hex VARCHAR(7), -- hex color code
  price_adjustment DECIMAL(8,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0, -- for pending orders
  low_stock_threshold INTEGER DEFAULT 5,
  weight DECIMAL(8,3),
  dimensions JSONB, -- {length, width, height} for shipping
  image_urls JSONB, -- variant-specific images
  status variant_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, size, color)
);

CREATE TYPE variant_status AS ENUM ('active', 'inactive', 'discontinued');
\`\`\`

#### Collections
\`\`\`sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  status collection_status DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE collection_status AS ENUM ('active', 'inactive', 'archived');

CREATE TABLE collection_products (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);
\`\`\`

#### Orders
\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES users(id),
  status order_status NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_intent_id VARCHAR(255),
  payment_method VARCHAR(50),
  
  -- Shipping information
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(255),
  
  -- Customer information
  customer_notes TEXT,
  admin_notes TEXT,
  
  -- Timestamps
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partially_refunded');
\`\`\`

#### Order Items
\`\`\`sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  product_snapshot JSONB NOT NULL -- store product details at time of order
);
\`\`\`

#### Customer Addresses
\`\`\`sql
CREATE TABLE customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type address_type NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  company VARCHAR(255),
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(50),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE address_type AS ENUM ('shipping', 'billing', 'both');
\`\`\`

#### Reviews
\`\`\`sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES users(id),
  order_id UUID NOT NULL REFERENCES orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSONB, -- customer photos
  verified_purchase BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  status review_status DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, customer_id, order_id)
);

CREATE TYPE review_status AS ENUM ('pending', 'published', 'hidden');
\`\`\`

#### Inventory Tracking
\`\`\`sql
CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES product_variants(id),
  movement_type inventory_movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  reference_id UUID, -- order_id, adjustment_id, etc.
  reference_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE inventory_movement_type AS ENUM ('sale', 'restock', 'adjustment', 'return', 'damage');
\`\`\`

#### Wishlists
\`\`\`sql
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, product_id, variant_id)
);
\`\`\`

## API Routes

### Authentication Routes
\`\`\`
POST   /api/auth/register          # Customer registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
POST   /api/auth/refresh           # Refresh JWT token
POST   /api/auth/forgot-password   # Password reset request
POST   /api/auth/reset-password    # Password reset confirmation
GET    /api/auth/verify-email      # Email verification
\`\`\`

### Customer Management
\`\`\`
GET    /api/customers/profile      # Get customer profile
PUT    /api/customers/profile      # Update customer profile
DELETE /api/customers/account      # Delete customer account
GET    /api/customers/addresses    # Get customer addresses
POST   /api/customers/addresses    # Add customer address
PUT    /api/customers/addresses/:id # Update customer address
DELETE /api/customers/addresses/:id # Delete customer address
GET    /api/customers/orders       # Get customer order history
GET    /api/customers/wishlist     # Get customer wishlist
POST   /api/customers/wishlist     # Add item to wishlist
DELETE /api/customers/wishlist/:id # Remove item from wishlist
\`\`\`

### Product Catalog (Direct Retail)
\`\`\`
GET    /api/products               # List all clothing products
GET    /api/products/featured      # Get featured products
GET    /api/products/search        # Search products
GET    /api/products/:id           # Get product details
GET    /api/products/:id/variants  # Get product variants
GET    /api/products/:id/reviews   # Get product reviews
POST   /api/products/:id/reviews   # Add product review

# Category and filtering
GET    /api/products/categories    # Get clothing categories
GET    /api/products/brands        # Get available brands
GET    /api/products/sizes         # Get available sizes by category
GET    /api/products/colors        # Get available colors

# Collections
GET    /api/collections            # Get all collections
GET    /api/collections/:slug      # Get collection products
\`\`\`

### Shopping Cart
\`\`\`
GET    /api/cart                   # Get cart contents
POST   /api/cart/items             # Add item to cart
PUT    /api/cart/items/:id         # Update cart item
DELETE /api/cart/items/:id         # Remove cart item
DELETE /api/cart                   # Clear cart
\`\`\`

### Order Management
\`\`\`
POST   /api/orders                 # Create order
GET    /api/orders/:id             # Get order details
POST   /api/orders/:id/cancel      # Cancel order
GET    /api/orders/:id/tracking    # Get order tracking info

# Admin order management
GET    /api/admin/orders           # List all orders
PUT    /api/admin/orders/:id/status # Update order status
POST   /api/admin/orders/:id/ship  # Mark order as shipped
POST   /api/admin/orders/:id/refund # Process refund
\`\`\`

### Admin Product Management
\`\`\`
POST   /api/admin/products         # Create product
PUT    /api/admin/products/:id     # Update product
DELETE /api/admin/products/:id     # Delete product
POST   /api/admin/products/:id/variants # Add product variant
PUT    /api/admin/products/:id/variants/:variantId # Update variant
DELETE /api/admin/products/:id/variants/:variantId # Delete variant

# Inventory management
GET    /api/admin/inventory        # Get inventory overview
PUT    /api/admin/inventory/:variantId # Update stock levels
GET    /api/admin/inventory/low-stock # Get low stock items
POST   /api/admin/inventory/adjustment # Record inventory adjustment

# Collections management
GET    /api/admin/collections      # List collections
POST   /api/admin/collections      # Create collection
PUT    /api/admin/collections/:id  # Update collection
DELETE /api/admin/collections/:id  # Delete collection
POST   /api/admin/collections/:id/products # Add products to collection
\`\`\`

### Analytics & Reporting
\`\`\`
GET    /api/admin/analytics/overview    # Dashboard overview
GET    /api/admin/analytics/sales       # Sales analytics
GET    /api/admin/analytics/products    # Product performance
GET    /api/admin/analytics/customers   # Customer analytics
GET    /api/admin/analytics/inventory   # Inventory reports
\`\`\`

### Payment Processing
\`\`\`
POST   /api/payments/intent        # Create payment intent
POST   /api/payments/confirm       # Confirm payment
POST   /api/payments/webhook       # Stripe webhook
\`\`\`

### File Upload
\`\`\`
POST   /api/upload/image           # Upload single image
POST   /api/upload/images          # Upload multiple images
DELETE /api/upload/:id             # Delete uploaded file
\`\`\`

## Authentication & Authorization

### JWT Token Structure
\`\`\`json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "customer|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
\`\`\`

### Role-Based Access Control

#### Customer Permissions
- Browse products and collections
- Manage shopping cart and wishlist
- Place and track orders
- Manage profile and addresses
- Leave product reviews

#### Admin Permissions
- All customer permissions
- Manage product catalog and inventory
- Process and manage orders
- View analytics and reports
- Manage customer accounts
- Configure site settings

## Direct Retail Features

### Inventory Management
- Real-time stock tracking
- Automatic low stock alerts
- Inventory movement logging
- Bulk inventory updates
- Seasonal inventory planning

### Order Fulfillment
- Automated order processing
- Shipping label generation
- Tracking number integration
- Return processing
- Refund management

### Customer Experience
- Personalized product recommendations
- Size and fit guidance
- Style quiz and preferences
- Loyalty program integration
- Customer service chat

### Fashion-Specific Features
- Visual search capabilities
- Style-based recommendations
- Seasonal collections
- Size conversion tools
- Fit predictor system
- Color matching
- Care instruction guides

## Performance Optimization

### Database Optimization
\`\`\`sql
-- Essential indexes for direct retail
CREATE INDEX idx_products_category_status ON products(category, status);
CREATE INDEX idx_products_featured ON products(featured, status);
CREATE INDEX idx_variants_stock ON product_variants(stock_quantity, status);
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at);
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status);
\`\`\`

### Caching Strategy
- Product catalog (15-minute TTL)
- Collection pages (30-minute TTL)
- User sessions (Redis)
- Search results (5-minute TTL)
- Inventory levels (real-time with cache invalidation)

## Security Considerations

### Data Protection
- Hash passwords with bcrypt (12+ rounds)
- Encrypt sensitive customer data
- PCI DSS compliance for payments
- GDPR compliance for EU customers
- Regular security audits

### API Security
- Rate limiting on all endpoints
- Input validation and sanitization
- CORS configuration
- Request size limits
- File upload restrictions

## Monitoring & Analytics

### Key Metrics
- Conversion rates
- Average order value
- Customer lifetime value
- Product performance
- Inventory turnover
- Return rates
- Customer satisfaction scores

### Business Intelligence
- Sales forecasting
- Trend analysis
- Customer segmentation
- Product recommendation effectiveness
- Seasonal pattern analysis

This architecture provides a comprehensive foundation for a direct retail clothing e-commerce platform with advanced inventory management, customer experience features, and fashion-specific functionality.
