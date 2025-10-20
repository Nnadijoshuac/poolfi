# PXXL Database Setup Script

# This script sets up the PoolFi database with PXXL PostgreSQL
# Prerequisites: Node.js 18+ must be installed

echo "Setting up PoolFi database with PXXL PostgreSQL..."

# Set the database URL
$env:DATABASE_URL="postgres://user_69a97e85:3c7b1e9755495d739f6d5dc7bf81926d@db.pxxl.pro:49077/db_965c6ba5"

# Navigate to frontend directory
cd "C:\Users\chimd\Desktop\serenity code\poolfi\frontend"

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migration
echo "Running database migration..."
npx prisma migrate dev --name init

# Verify database connection
echo "Testing database connection..."
npx prisma db push

echo "Database setup complete!"
echo "You can now start the development server with: npm run dev"
