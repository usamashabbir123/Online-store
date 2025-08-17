#!/bin/sh

echo "🔧 Starting FashionHub Backend..."

# Change to backend directory
cd /app/backend

# Start the backend server
exec node src/server.js
