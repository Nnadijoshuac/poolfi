# PoolFi Frontend Deployment Guide

This guide will help you deploy the PoolFi frontend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **WalletConnect Project ID**: Get one from [cloud.walletconnect.com](https://cloud.walletconnect.com)
4. **Smart Contract Addresses**: Deploy your contracts and get the addresses

## Deployment Steps

### 1. Prepare Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

#### Required Variables:
- `NEXT_PUBLIC_POOL_MANAGER_ADDRESS`: Your deployed PoolManager contract address
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID
- `NEXT_PUBLIC_REEF_RPC_URL`: Reef network RPC URL (use `https://rpc.reefscan.com` for production)
- `NEXT_PUBLIC_REEF_CHAIN_ID`: Reef chain ID (`13939` for mainnet)

#### Optional Variables:
- `NEXT_PUBLIC_GA_ID`: Google Analytics ID for tracking
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for error monitoring

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set the following:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. Add your environment variables in the "Environment Variables" section
6. Click "Deploy"

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   # For preview deployment
   vercel

   # For production deployment
   vercel --prod
   ```

### 3. Configure Custom Domain (Optional)

1. Go to your project settings in Vercel dashboard
2. Navigate to "Domains" section
3. Add your custom domain
4. Follow the DNS configuration instructions

## Build Optimization

The project is configured with several optimizations for production:

- **Image Optimization**: WebP and AVIF formats with caching
- **Code Splitting**: Automatic vendor and common chunk splitting
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Compression**: Gzip compression enabled
- **Bundle Analysis**: Use `npm run analyze` to analyze bundle size

## Monitoring and Analytics

### Bundle Analysis
```bash
npm run analyze
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all environment variables are set
   - Ensure all dependencies are installed
   - Check for TypeScript errors with `npm run type-check`

2. **Wallet Connection Issues**:
   - Verify WalletConnect Project ID is correct
   - Check that RPC URLs are accessible
   - Ensure chain ID matches your network

3. **Contract Interaction Issues**:
   - Verify contract addresses are correct
   - Check that contracts are deployed on the correct network
   - Ensure user has sufficient REEF tokens for gas

### Performance Optimization:

1. **Enable Vercel Analytics** in project settings
2. **Set up monitoring** with Sentry or similar service
3. **Use Vercel's Edge Functions** for API routes if needed
4. **Optimize images** using Next.js Image component

## Environment-Specific Configurations

### Development
- Uses local RPC URL for testing
- Includes testnet configurations
- Hot reloading enabled

### Production
- Uses mainnet RPC URLs
- Optimized builds
- Security headers enabled
- Analytics and monitoring ready

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to git
2. **CSP Headers**: Configured for SVG images
3. **Security Headers**: X-Frame-Options, X-Content-Type-Options set
4. **HTTPS**: Automatically enabled on Vercel

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with production build: `npm run build && npm start`
4. Check browser console for client-side errors

## Next Steps After Deployment

1. **Test all functionality** on the deployed site
2. **Set up monitoring** and error tracking
3. **Configure analytics** if needed
4. **Update documentation** with live URLs
5. **Set up CI/CD** for automatic deployments
