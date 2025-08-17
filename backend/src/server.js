require('express-async-errors');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const xss = require('xss-clean');
const winston = require('winston');
const path = require('path');

// Load configuration
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload');
const adminRoutes = require('./routes/admin');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const securityLogger = require('./utils/securityLogger');

// Initialize Express app
const app = express();

// Configure logging
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'fashionhub-backend' },
  transports: [
    new winston.transports.File({ 
      filename: config.logging.file,
      maxsize: config.logging.max_size,
      maxFiles: config.logging.max_files
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Security middleware
if (config.security.helmet.enabled) {
  app.use(helmet({
    contentSecurityPolicy: config.security.helmet.content_security_policy
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: config.security.rate_limit.window_ms,
  max: config.security.rate_limit.max_requests,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: config.security.cors_origin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security middleware
app.use(hpp());
app.use(xss());

// Compression middleware
app.use(compression());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.app.environment,
    version: config.app.version
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

// Security logging
app.use(securityLogger);

// Start server
const PORT = config.app.port || 5000;
const HOST = config.app.host || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  logger.info(`🚀 FashionHub Backend Server running on ${HOST}:${PORT}`);
  logger.info(`📊 Environment: ${config.app.environment}`);
  logger.info(`🔗 Health check: http://${HOST}:${PORT}/health`);
  
  if (config.isDevelopment()) {
    logger.info(`🔧 Development mode enabled`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
