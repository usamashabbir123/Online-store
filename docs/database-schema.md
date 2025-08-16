# MarketHub Database Schema

## Overview
This document describes the complete database schema for the MarketHub multi-vendor marketplace platform.

## Database: PostgreSQL 15+

### Extensions Required
\`\`\`sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
\`\`\`

## Core Tables

### 1. Users Table
Stores all user accounts (customers, sellers, admins).

\`\`\`sql
CREATE TYPE user_role AS ENUM ('customer', 'seller', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned', 'pending_verification');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    role user_role NOT NULL DEFAULT 'customer',
    status user_status NOT NULL DEFAULT 'pending_verification',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
\`\`\`

### 2. Stores Table
Stores information about seller stores.

\`\`\`sql
CREATE TYPE store_status AS ENUM ('pending', 'approved', 'rejected', 'suspended', 'closed');

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    website_url VARCHAR(500),
    
    -- Business Information
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    tax_id VARCHAR(100),
    
    -- Financial
    setup_fee_paid BOOLEAN DEFAULT FALSE,
    setup_fee_amount DECIMAL(10,2) DEFAULT 299.00,
    setup_fee_payment_id VARCHAR(255),
    commission_rate DECIMAL(5,4) DEFAULT 0.05, -- 5%
    
    -- Settings
    auto_approve_orders BOOLEAN DEFAULT TRUE,
    vacation_mode BOOLEAN DEFAULT FALSE,
    vacation_message TEXT,
    
    -- Metrics (updated by triggers/jobs)
    total_sales DECIMAL(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_category ON stores(category);
CREATE INDEX idx_stores_created_at ON stores(created_at);
\`\`\`

### 3. Store Applications Table
Tracks store application process.

\`\`\`sql
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'payment_pending');

CREATE TABLE store_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Store Information
    store_name VARCHAR(255) NOT NULL,
    store_slug VARCHAR(255) NOT NULL,
    store_description TEXT,
    category VARCHAR(100),
    
    -- Business Details
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    tax_id VARCHAR(100),
    phone VARCHAR(50),
    address TEXT,
    
    -- Documents (JSON array of file URLs)
    documents JSONB DEFAULT '[]',
    
    -- Bank Account (encrypted)
    bank_account_encrypted TEXT,
    
    -- Application Status
    status application_status DEFAULT 'pending',
    admin_notes TEXT,
    rejection_reason VARCHAR(500),
    
    -- Payment Information
    payment_intent_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_store_applications_user_id ON store_applications(user_id);
CREATE INDEX idx_store_applications_status ON store_applications(status);
CREATE INDEX idx_store_applications_submitted_at ON store_applications(submitted_at);
\`\`\`

### 4. Products Table
Stores product information.

\`\`\`sql
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived', 'out_of_stock');

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2), -- Original price for sales
    cost_price DECIMAL(10,2), -- Cost to seller
    
    -- Inventory
    sku VARCHAR(100),
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    track_quantity BOOLEAN DEFAULT TRUE,
    allow_backorders BOOLEAN DEFAULT FALSE,
    
    -- Classification
    category VARCHAR(100),
    brand VARCHAR(100),
    tags TEXT[], -- Array of tags
    
    -- Physical Properties
    weight DECIMAL(8,3), -- in kg
    dimensions JSONB, -- {length, width, height} in cm
    
    -- Media
    images JSONB DEFAULT '[]', -- Array of image URLs
    video_url VARCHAR(500),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    
    -- Status
    status product_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    
    -- Metrics (updated by triggers)
    view_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(store_id, slug)
);

-- Indexes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_store_status ON products(store_id, status);
CREATE INDEX idx_products_category_status ON products(category, status);

-- Full text search index
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
\`\`\`

### 5. Product Variants Table
For products with variations (size, color, etc.).

\`\`\`sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    -- Variant Information
    name VARCHAR(255) NOT NULL, -- e.g., "Large Red"
    sku VARCHAR(100),
    
    -- Pricing (overrides product price if set)
    price DECIMAL(10,2),
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    
    -- Variant Options (JSON)
    options JSONB NOT NULL, -- e.g., {"size": "Large", "color": "Red"}
    
    -- Media
    image_url VARCHAR(500),
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(product_id, options)
);

-- Indexes
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_active ON product_variants(active);
\`\`\`

### 6. Orders Table
Stores order information.

\`\`\`sql
CREATE TYPE order_status AS ENUM (
    'pending', 'confirmed', 'processing', 'shipped', 
    'delivered', 'cancelled', 'refunded', 'disputed'
);

CREATE TYPE payment_status AS ENUM (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Relationships
    customer_id UUID NOT NULL REFERENCES users(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    
    -- Status
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status DEFAULT 'pending',
    
    -- Financial
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT
