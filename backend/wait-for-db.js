const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function waitForDatabase() {
  let retries = 30;
  const delay = 2000; // 2 seconds

  while (retries > 0) {
    try {
      console.log(`⏳ Attempting to connect to database... (${retries} retries left)`);
      
      // Try to connect to the database
      await prisma.$connect();
      
      // Test a simple query
      await prisma.$queryRaw`SELECT 1`;
      
      console.log('✅ Database connection successful!');
      await prisma.$disconnect();
      return true;
    } catch (error) {
      console.log(`❌ Database connection failed: ${error.message}`);
      retries--;
      
      if (retries === 0) {
        console.error('❌ Failed to connect to database after 30 attempts');
        process.exit(1);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Run the wait function
waitForDatabase()
  .then(() => {
    console.log('🚀 Database is ready!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error waiting for database:', error);
    process.exit(1);
  });
