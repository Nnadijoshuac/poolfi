# Database Setup Guide

This guide explains how to set up PostgreSQL with Prisma for the PoolFi waitlist feature.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## Option 1: Local PostgreSQL Installation

### Install PostgreSQL

**Windows:**
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Set a password for the `postgres` user
4. Note the port (default: 5432)

**macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
createdb poolfi
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create Database
```sql
-- Connect to PostgreSQL as postgres user
psql -U postgres

-- Create database and user
CREATE DATABASE poolfi;
CREATE USER poolfi_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE poolfi TO poolfi_user;
\q
```

## Option 2: Cloud Database (Recommended)

### Railway
1. Go to https://railway.app
2. Create a new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from the service

### Supabase
1. Go to https://supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy the connection string

### Neon
1. Go to https://neon.tech
2. Create new project
3. Copy the connection string

## Environment Setup

1. Copy the environment example:
```bash
cd frontend
cp env.example .env.local
```

2. Update `.env.local` with your database URL:
```env
# For local PostgreSQL
DATABASE_URL="postgresql://poolfi_user:your_secure_password@localhost:5432/poolfi?schema=public"

# For cloud database (use the URL provided by your service)
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
```

## Database Migration

Once your database is set up and running:

```bash
cd frontend

# Run initial migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# View your database in Prisma Studio (optional)
npx prisma studio
```

## Testing the Setup

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3001
3. Click "Get Started" to open the waitlist modal
4. Submit a test entry
5. Check your database to verify the data was saved

## Database Management Commands

```bash
# View database in browser
npx prisma studio

# Reset database (removes all data)
npx prisma migrate reset

# Apply schema changes
npx prisma db push

# Generate client after schema changes
npx prisma generate

# Check database status
npx prisma migrate status
```

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure firewall allows connections
- For cloud databases, check IP allowlist

### Migration Errors
```bash
# If migrations are out of sync
npx prisma migrate reset
npx prisma migrate dev
```

### Client Generation Issues
```bash
# Regenerate client
npx prisma generate
```

## Production Deployment

### Environment Variables
Set the following in your production environment:
- `DATABASE_URL`: Your production PostgreSQL connection string

### Deployment Steps
1. Run migrations in production:
```bash
npx prisma migrate deploy
```

2. Generate client:
```bash
npx prisma generate
```

## Database Schema

The waitlist table includes:
- `id`: Unique identifier (CUID)
- `name`: User's name (required)
- `email`: User's email (required, unique)
- `country`: User's country (optional)
- `ipAddress`: User's IP address (auto-captured)
- `userAgent`: User's browser info (auto-captured)
- `createdAt`: Timestamp when record was created
- `updatedAt`: Timestamp when record was last updated