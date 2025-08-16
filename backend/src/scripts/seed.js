const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@fashionhub.com' },
      update: {},
      create: {
        email: 'admin@fashionhub.com',
        passwordHash: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        status: 'active',
        emailVerified: true
      }
    });
    console.log('✅ Admin user created:', admin.email);

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = await prisma.user.upsert({
      where: { email: 'customer@example.com' },
      update: {},
      create: {
        email: 'customer@example.com',
        passwordHash: customerPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
        status: 'active',
        emailVerified: true
      }
    });
    console.log('✅ Customer user created:', customer.email);

    // Create sample seller
    const sellerPassword = await bcrypt.hash('seller123', 12);
    const seller = await prisma.user.upsert({
      where: { email: 'seller@example.com' },
      update: {},
      create: {
        email: 'seller@example.com',
        passwordHash: sellerPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'seller',
        status: 'active',
        emailVerified: true
      }
    });
    console.log('✅ Seller user created:', seller.email);

    // Create sample store
    const store = await prisma.store.upsert({
      where: { ownerId: seller.id },
      update: {},
      create: {
        ownerId: seller.id,
        name: 'Fashion Forward',
        slug: 'fashion-forward',
        description: 'Premium fashion clothing for the modern individual',
        status: 'approved',
        category: 'fashion',
        phone: '+1234567890',
        email: 'contact@fashionforward.com',
        businessName: 'Fashion Forward LLC',
        businessType: 'llc',
        setupFeePaid: true
      }
    });
    console.log('✅ Store created:', store.name);

    // Create sample products
    const products = [
      {
        name: 'Classic White T-Shirt',
        slug: 'classic-white-tshirt',
        description: 'Premium cotton classic white t-shirt, perfect for everyday wear',
        price: 29.99,
        comparePrice: 39.99,
        category: 'tops',
        gender: 'unisex',
        ageGroup: 'adult',
        brand: 'Fashion Forward',
        material: '100% Cotton',
        stockQuantity: 100,
        images: ['https://via.placeholder.com/400x500/FFFFFF/000000?text=White+T-Shirt']
      },
      {
        name: 'Slim Fit Jeans',
        slug: 'slim-fit-jeans',
        description: 'Modern slim fit jeans with stretch comfort',
        price: 79.99,
        comparePrice: 99.99,
        category: 'bottoms',
        gender: 'men',
        ageGroup: 'adult',
        brand: 'Fashion Forward',
        material: '98% Cotton, 2% Elastane',
        stockQuantity: 50,
        images: ['https://via.placeholder.com/400x500/000080/FFFFFF?text=Slim+Fit+Jeans']
      },
      {
        name: 'Summer Dress',
        slug: 'summer-dress',
        description: 'Light and breezy summer dress perfect for warm days',
        price: 89.99,
        comparePrice: 119.99,
        category: 'dresses',
        gender: 'women',
        ageGroup: 'adult',
        brand: 'Fashion Forward',
        material: '100% Polyester',
        stockQuantity: 75,
        images: ['https://via.placeholder.com/400x500/FFB6C1/000000?text=Summer+Dress']
      },
      {
        name: 'Casual Blazer',
        slug: 'casual-blazer',
        description: 'Versatile casual blazer for professional and casual occasions',
        price: 149.99,
        comparePrice: 199.99,
        category: 'outerwear',
        gender: 'unisex',
        ageGroup: 'adult',
        brand: 'Fashion Forward',
        material: '65% Polyester, 35% Wool',
        stockQuantity: 30,
        images: ['https://via.placeholder.com/400x500/2F4F4F/FFFFFF?text=Casual+Blazer']
      },
      {
        name: 'Athletic Shorts',
        slug: 'athletic-shorts',
        description: 'Comfortable athletic shorts for workouts and casual wear',
        price: 34.99,
        comparePrice: 44.99,
        category: 'activewear',
        gender: 'unisex',
        ageGroup: 'adult',
        brand: 'Fashion Forward',
        material: '90% Polyester, 10% Spandex',
        stockQuantity: 120,
        images: ['https://via.placeholder.com/400x500/32CD32/FFFFFF?text=Athletic+Shorts']
      }
    ];

    for (const productData of products) {
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          ...productData,
          storeId: store.id,
          status: 'active'
        }
      });
      console.log('✅ Product created:', product.name);
    }

    // Create sample addresses for customer
    const addresses = [
      {
        userId: customer.id,
        type: 'shipping',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        phone: '+1234567890',
        isDefault: true
      },
      {
        userId: customer.id,
        type: 'billing',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
        phone: '+1234567890',
        isDefault: true
      }
    ];

    for (const addressData of addresses) {
      const address = await prisma.address.create({
        data: addressData
      });
      console.log('✅ Address created for:', address.firstName, address.lastName);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('Admin: admin@fashionhub.com / admin123');
    console.log('Customer: customer@example.com / customer123');
    console.log('Seller: seller@example.com / seller123');

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
