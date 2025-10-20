# PXXL Database Setup Instructions

## Prerequisites

Before setting up the database, you need to install Node.js:

1. **Download Node.js**: Go to https://nodejs.org and download the LTS version (18+)
2. **Install Node.js**: Run the installer and follow the setup wizard
3. **Verify Installation**: Open a new PowerShell window and run:
   ```powershell
   node --version
   npm --version
   ```

## Database Setup Steps

Once Node.js is installed, follow these steps:

### Option 1: Run the Setup Script (Recommended)

1. Open PowerShell as Administrator
2. Navigate to your project directory:
   ```powershell
   cd "C:\Users\chimd\Desktop\serenity code\poolfi"
   ```
3. Run the setup script:
   ```powershell
   .\setup-pxxl-database.ps1
   ```

### Option 2: Manual Setup

1. Open PowerShell and navigate to the frontend directory:
   ```powershell
   cd "C:\Users\chimd\Desktop\serenity code\poolfi\frontend"
   ```

2. Set the database URL:
   ```powershell
   $env:DATABASE_URL="postgres://user_69a97e85:3c7b1e9755495d739f6d5dc7bf81926d@db.pxxl.pro:49077/db_965c6ba5"
   ```

3. Install dependencies:
   ```powershell
   npm install
   ```

4. Generate Prisma client:
   ```powershell
   npx prisma generate
   ```

5. Run database migration:
   ```powershell
   npx prisma migrate dev --name init
   ```

6. Test the connection:
   ```powershell
   npx prisma db push
   ```

## Verification

After setup, you can verify everything is working:

1. **Start the development server**:
   ```powershell
   npm run dev
   ```

2. **Open Prisma Studio** (optional):
   ```powershell
   npx prisma studio
   ```

3. **Test the waitlist feature**:
   - Open http://localhost:3000
   - Click "Get Started" to open the waitlist modal
   - Submit a test entry
   - Check your PXXL database to verify the data was saved

## Database Configuration

The database is now configured with:
- **Provider**: PostgreSQL
- **Host**: db.pxxl.pro
- **Port**: 49077
- **Database**: db_965c6ba5
- **Username**: user_69a97e85

## Troubleshooting

### If you get connection errors:
- Verify your internet connection
- Check if the PXXL database is accessible
- Ensure the connection string is correct

### If Prisma commands fail:
- Make sure Node.js is installed and in your PATH
- Try running `npm install` again
- Check if all dependencies are properly installed

### If migrations fail:
- Check the database connection
- Verify the schema is correct
- Try running `npx prisma migrate reset` if needed

## Next Steps

Once the database is set up:
1. The waitlist feature will be fully functional
2. User data will be stored in your PXXL PostgreSQL database
3. You can deploy your application with the configured database

## Environment Variables

The following environment variables are configured:
- `DATABASE_URL`: Your PXXL PostgreSQL connection string
- `NEXT_PUBLIC_POOL_MANAGER_ADDRESS`: Smart contract address
- `NEXT_PUBLIC_REEF_RPC_URL`: Reef blockchain RPC endpoint
- `NEXT_PUBLIC_REEF_CHAIN_ID`: Reef chain ID (13939)
