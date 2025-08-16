const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user with specified credentials
    const adminPassword = await bcrypt.hash('admin', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'usamashabir37@gmail.com' },
      update: {},
      create: {
        email: 'usamashabir37@gmail.com',
        passwordHash: adminPassword,
        firstName: 'Usama',
        lastName: 'Shabir',
        role: 'admin',
        status: 'active',
        emailVerified: true
      }
    });
    console.log('✅ Admin user created:', admin.email);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Admin Login Credentials:');
    console.log('Email: usamashabir37@gmail.com');
    console.log('Password: admin');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
