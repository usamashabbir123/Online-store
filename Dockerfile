# Multi-stage build for FashionHub combined application
# This Dockerfile creates a single image containing both frontend and backend

# Stage 1: Base Node.js image
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    libc6-compat \
    openssl \
    openssl-dev \
    && rm -rf /var/cache/apk/*

# Stage 2: Backend dependencies
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Stage 3: Frontend dependencies
FROM base AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

# Stage 4: Backend build
FROM backend-deps AS backend-build
WORKDIR /app/backend
COPY backend/ .
RUN npx prisma generate

# Stage 5: Frontend build
FROM frontend-deps AS frontend-build
WORKDIR /app/frontend
COPY frontend/ .
RUN npm run build

# Stage 6: Runtime image
FROM base AS runtime

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy configuration files (both for local and production)
COPY --chown=nextjs:nodejs config/ ./config/

# Copy backend files
COPY --from=backend-build --chown=nextjs:nodejs /app/backend ./backend
COPY --from=frontend-build --chown=nextjs:nodejs /app/frontend/.next ./frontend/.next
COPY --from=frontend-build --chown=nextjs:nodejs /app/frontend/public ./frontend/public
COPY --from=frontend-build --chown=nextjs:nodejs /app/frontend/package.json ./frontend/package.json
COPY --from=frontend-deps --chown=nextjs:nodejs /app/frontend/node_modules ./frontend/node_modules

# Create necessary directories
RUN mkdir -p uploads logs
RUN chown -R nextjs:nodejs uploads logs

# Copy startup scripts
COPY --chown=nextjs:nodejs scripts/ ./scripts/
RUN chmod +x scripts/start.sh scripts/start-frontend.sh scripts/start-backend.sh

# Expose ports
EXPOSE 3000 5000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000
ENV NEXT_PUBLIC_API_URL=http://localhost:5000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start both services using the startup script
CMD ["./scripts/start.sh"]
