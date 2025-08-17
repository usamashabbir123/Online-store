const { PrismaClient } = require('@prisma/client');
const config = require('../config');

// Create Prisma client with configuration
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: config.getDatabaseUrl()
    }
  },
  log: config.isDevelopment() ? ['query', 'info', 'warn', 'error'] : ['error']
});

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query test successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = { prisma, testConnection };
