# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install system dependencies for Prisma and other packages
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Generate Prisma client
RUN npx prisma generate

# Make startup script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application with database setup
CMD ["./start.sh"]
