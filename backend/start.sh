#!/bin/sh

echo "🚀 Starting FashionHub Backend..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
node wait-for-db.js

# Run database setup
echo "🔄 Setting up database..."
npx prisma db push --accept-data-loss

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate deploy

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed

# Start the application
echo "🎯 Starting application..."
npm start
