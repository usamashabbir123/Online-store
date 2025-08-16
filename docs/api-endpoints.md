# MarketHub API Endpoints Reference

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://api.markethub.com/api`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## Response Format
All API responses follow this structure:
\`\`\`json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
\`\`\`

Error responses:
\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer" // or "seller"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer",
      "emailVerified": false
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
\`\`\`

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
\`\`\`

### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
\`\`\`json
{
  "refreshToken": "refresh_token"
}
\`\`\`

### POST /auth/logout
Logout user and invalidate tokens.

**Headers:** `Authorization: Bearer <token>`

## User Management Endpoints

### GET /users/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "status": "active",
    "emailVerified": true,
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
\`\`\`

### PUT /users/profile
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
\`\`\`

## Store Management Endpoints

### POST /stores/apply
Submit store application.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "storeName": "Tech Innovations Hub",
  "storeUrl": "tech-innovations-hub",
  "description": "Specializing in cutting-edge electronics",
  "category": "electronics",
  "businessName": "Tech Innovations LLC",
  "businessType": "llc",
  "taxId": "12-3456789",
  "phone": "+1234567890",
  "address": "123 Tech Street, Silicon Valley, CA",
  "bankAccount": {
    "bankName": "Chase Bank",
    "accountNumber": "encrypted_account_number",
    "routingNumber": "encrypted_routing_number",
    "accountHolder": "Tech Innovations LLC"
  }
}
\`\`\`

### GET /stores/application
Get store application status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending",
    "businessName": "Tech Innovations LLC",
    "submittedAt": "2024-01-15T10:00:00Z",
    "adminNotes": null
  }
}
\`\`\`

### GET /stores/:id
Get store details (public endpoint).

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Tech Innovations Hub",
    "slug": "tech-innovations-hub",
    "description": "Specializing in cutting-edge electronics",
    "logoUrl": "https://cdn.example.com/logo.png",
    "bannerUrl": "https://cdn.example.com/banner.png",
    "category": "electronics",
    "rating": 4.8,
    "reviewCount": 1247,
    "totalProducts": 156,
    "joinedAt": "2024-01-01T00:00:00Z"
  }
}
\`\`\`

### PUT /stores/:id
Update store settings (owner only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "name": "Updated Store Name",
  "description": "Updated description",
  "phone": "+1234567890",
  "email": "contact@store.com"
}
\`\`\`

## Product Management Endpoints

### GET /products
List products with filtering and pagination.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `category` - Filter by category
- `store_id` - Filter by store
- `search` - Search in name and description
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `sort` - Sort by: `price_asc`, `price_desc`, `rating`, `newest`

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "price": 89.99,
      "comparePrice": 129.99,
      "images": ["https://cdn.example.com/image1.jpg"],
      "rating": 4.5,
      "reviewCount": 234,
      "store": {
        "id": "uuid",
        "name": "Tech Store",
        "slug": "tech-store"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
\`\`\`

### GET /products/:id
Get product details.

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Wireless Headphones",
    "slug": "wireless-headphones",
    "description": "High-quality wireless headphones...",
    "price": 89.99,
    "comparePrice": 129.99,
    "stockQuantity": 25,
    "sku": "WH-001",
    "category": "electronics",
    "brand": "TechBrand",
    "images": [
      "https://cdn.example.com/image1.jpg",
      "https://cdn.example.com/image2.jpg"
    ],
    "specifications": {
      "weight": "250g",
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0"
    },
    "store": {
      "id": "uuid",
      "name": "Tech Store",
      "slug": "tech-store",
      "rating": 4.8
    },
    "rating": 4.5,
    "reviewCount": 234
  }
}
\`\`\`

### POST /products
Create new product (seller only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 89.99,
  "comparePrice": 129.99,
  "costPrice": 45.00,
  "sku": "WH-001",
  "stockQuantity": 100,
  "category": "electronics",
  "brand": "TechBrand",
  "weight": 0.25,
  "dimensions": {
    "length": 20,
    "width": 15,
    "height": 8
  },
  "images": [
    "https://cdn.example.com/image1.jpg"
  ]
}
\`\`\`

### PUT /products/:id
Update product (seller only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:** Same as POST /products

### DELETE /products/:id
Delete product (seller only).

**Headers:** `Authorization: Bearer <token>`

## Order Management Endpoints

### POST /orders
Create new order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "unitPrice": 89.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "billingAddress": {
    // Same structure as shippingAddress
  },
  "paymentMethodId": "pm_stripe_payment_method_id"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD-2024-001",
    "status": "pending",
    "subtotal": 179.98,
    "taxAmount": 14.40,
    "shippingAmount": 9.99,
    "totalAmount": 204.37,
    "paymentIntentId": "pi_stripe_payment_intent_id",
    "items": [
      {
        "id": "uuid",
        "productId": "uuid",
        "productName": "Wireless Headphones",
        "quantity": 2,
        "unitPrice": 89.99,
        "totalPrice": 179.98
      }
    ]
  }
}
\`\`\`

### GET /orders
List user orders.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `status` - Filter by order status

### GET /orders/:id
Get order details.

**Headers:** `Authorization: Bearer <token>`

### PUT /orders/:id/status
Update order status (seller only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "status": "processing",
  "trackingNumber": "1Z999AA1234567890",
  "notes": "Order is being prepared for shipment"
}
\`\`\`

## Payment Endpoints

### POST /payments/intent
Create payment intent for order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "orderId": "uuid",
  "paymentMethodId": "pm_stripe_payment_method_id"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "clientSecret": "pi_stripe_client_secret",
    "paymentIntentId": "pi_stripe_payment_intent_id"
  }
}
\`\`\`

### POST /payments/webhook
Stripe webhook endpoint (internal use).

## File Upload Endpoints

### POST /upload/image
Upload single image.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `image` - Image file (max 5MB, jpg/png/webp)
- `type` - Upload type: `product`, `store_logo`, `store_banner`, `avatar`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/image.jpg",
    "thumbnailUrl": "https://cdn.example.com/image_thumb.jpg",
    "filename": "unique_filename.jpg",
    "size": 1024000
  }
}
\`\`\`

### POST /upload/document
Upload document (business license, tax certificate).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `document` - Document file (max 10MB, pdf/jpg/png)
- `type` - Document type: `business_license`, `tax_certificate`

## Admin Endpoints

### GET /admin/stores
List all stores (admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit` - Pagination
- `status` - Filter by store status
- `category` - Filter by category

### PUT /admin/stores/:id/approve
Approve store application (admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "notes": "Store approved - all documents verified"
}
\`\`\`

### PUT /admin/stores/:id/reject
Reject store application (admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "reason": "incomplete_documents",
  "notes": "Business license is expired"
}
\`\`\`

### GET /admin/users
List all users (admin only).

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`, `limit` - Pagination
- `role` - Filter by user role
- `status` - Filter by user status

### PUT /admin/users/:id/status
Update user status (admin only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
\`\`\`json
{
  "status": "suspended",
  "reason": "Terms of service violation"
}
\`\`\`

## Error Codes

### Authentication Errors
- `AUTH_INVALID_CREDENTIALS` - Invalid email/password
- `AUTH_TOKEN_EXPIRED` - JWT token expired
- `AUTH_TOKEN_INVALID` - Invalid JWT token
- `AUTH_INSUFFICIENT_PERMISSIONS` - User lacks required permissions

### Validation Errors
- `VALIDATION_ERROR` - Request validation failed
- `DUPLICATE_EMAIL` - Email already exists
- `DUPLICATE_STORE_SLUG` - Store URL already taken

### Business Logic Errors
- `STORE_NOT_APPROVED` - Store not approved for operations
- `INSUFFICIENT_STOCK` - Product out of stock
- `ORDER_ALREADY_PROCESSED` - Order cannot be modified
- `PAYMENT_FAILED` - Payment processing failed

### System Errors
- `INTERNAL_SERVER_ERROR` - Unexpected server error
- `SERVICE_UNAVAILABLE` - External service unavailable
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

### Default Limits
- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- File upload endpoints: 10 requests per minute
- Admin endpoints: 200 requests per minute

### Headers
Rate limit information is included in response headers:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
