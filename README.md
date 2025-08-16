# FashionHub - E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js frontend and Node.js backend.

## 🏗️ Project Structure

```
Online-store/
├── frontend/          # Next.js 15 + React 19 Frontend
├── backend/           # Node.js + Express.js Backend
└── docs/             # Project Documentation
```

## 🚀 Quick Start

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at: http://localhost:3000

### Backend (Node.js + PostgreSQL)
```bash
cd backend
npm install
# Copy .env.example to .env and configure
npm run dev
```
Backend will be available at: http://localhost:5000

### Using Docker (Recommended)
```bash
cd backend
docker-compose up -d
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 + React 19
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form + Zod
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + Refresh Tokens
- **Payments**: Stripe, PayPal, Crypto
- **Security**: 2FA, Rate Limiting, Security Logging
- **File Upload**: Multer + Sharp
- **Validation**: Express-validator
- **Logging**: Winston + Pino

## 📚 Documentation

- **API Endpoints**: See `docs/api-endpoints.md`
- **Backend Architecture**: See `docs/backend-architecture.md`
- **Database Schema**: See `docs/database-schema.md`
- **Backend Security**: See `backend/security-documentation.md`

## 🔐 Security Features

- Two-Factor Authentication (TOTP)
- Rate Limiting & DDoS Protection
- Security Headers (Helmet)
- Input Validation & Sanitization
- JWT Token Management
- Account Lockout Protection
- Security Event Logging
- XSS & CSRF Protection

## 💳 Payment Methods

- Stripe (Credit Cards)
- PayPal
- Crypto (Coinbase Commerce)

## 🐳 Docker Support

Both frontend and backend include Docker configurations for easy development and deployment.

## 📝 License

MIT License - see LICENSE file for details.

---

**Note**: This project is automatically synced with v0.app deployments and deployed on Vercel.