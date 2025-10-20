# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

PoolFi is a decentralized savings platform built on the Reef blockchain that enables collaborative savings pools. Users can create savings pools with custom targets and contribution amounts, join existing pools, and automatically distribute funds when goals are reached.

## Development Commands

### Frontend Development
All development commands should be run from the `frontend/` directory:

```bash
# Development
cd frontend
npm run dev          # Start dev server on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Root-level commands (proxy to frontend):
```bash
npm run dev          # Proxies to frontend dev server
npm run build        # Proxies to frontend build
npm run start        # Proxies to frontend start
```

### Testing the Smart Contract
```bash
cd smart-contracts
# Contract is already deployed at 0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
# No local testing setup is currently configured
```

## Architecture Overview

### Monorepo Structure
- **`/frontend/`** - Next.js 14 application with App Router
- **`/smart-contracts/`** - Solidity contracts (deployed on Reef Pelagia)
- **Root package.json** - Proxies commands to frontend

### Frontend Architecture

#### Key Technologies
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Wagmi + Viem** for blockchain interaction
- **RainbowKit** for wallet connection (though simplified providers are used)

#### Component Architecture
- **`/app/`** - Next.js App Router pages and layouts
- **`/components/`** - Reusable UI components
  - **`/modals/`** - Modal components for user interactions
  - **`/landing/`** - Landing page specific components
- **`/hooks/`** - Custom React hooks for blockchain interactions
- **`/lib/`** - Utility functions and configurations

#### Key Hooks and Services
- **`usePoolManager`** - Main hook for smart contract interactions
  - Handles pool creation, joining, contributing, withdrawing
  - Manages pool data fetching and state
  - Contains complete ABI definitions
- **`useRecentActivities`** - Manages activity tracking
- **Supabase integration** - Handles waitlist and user data

### Smart Contract Integration

#### Contract Details
- **Address**: `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47`
- **Network**: Reef Pelagia (Chain ID: 13939)
- **RPC**: `http://34.123.142.246:8545`

#### Core Contract Functions
- `createPool()` - Create new savings pools
- `contribute()` - Join and contribute to pools
- `withdraw()` - Withdraw funds from completed pools
- `cancelPool()` - Cancel pools after deadline
- View functions for pool info, member details, and user pools

### State Management
- Uses React hooks and component state
- No global state management (Redux/Zustand)
- Contract state is fetched directly via Wagmi hooks

## Environment Configuration

### Required Environment Variables
```bash
# Contract Configuration
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47
NEXT_PUBLIC_REEF_RPC_URL=http://34.123.142.246:8545
NEXT_PUBLIC_REEF_CHAIN_ID=13939

# WalletConnect (if using wallet features)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Database (for waitlist feature)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setup Instructions
1. Copy `frontend/env.example` to `frontend/.env.local`
2. The contract address and Reef network settings are pre-configured
3. Add WalletConnect project ID if implementing wallet features

## Blockchain Integration

### Network Configuration
The app is configured for **Reef Pelagia testnet**:
- Chain ID: 13939
- Native currency: REEF
- Block explorer: https://dev.papi.how/explorer

### Contract Interaction Pattern
All contract interactions use the `usePoolManager` hook which:
1. Reads contract state using `useReadContract`
2. Writes to contract using `useWriteContract`
3. Waits for transaction confirmation with `useWaitForTransactionReceipt`
4. Handles loading states and errors

### Data Flow
1. **Pool Creation**: Frontend form → `createPool` hook → Smart contract
2. **Pool Display**: Smart contract → `fetchPoolInfo` → React state → UI
3. **User Actions**: UI interactions → Contract function calls → State updates

## Development Guidelines

### Code Patterns
- **Hooks**: Custom hooks handle all blockchain interactions
- **Components**: Functional components with TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Error Handling**: Toast notifications for user feedback

### File Naming
- Components: PascalCase (`CreatePoolModal.tsx`)
- Hooks: camelCase starting with 'use' (`usePoolManager.ts`)
- Pages: lowercase (`page.tsx`, `layout.tsx`)

### Deployment
- **Frontend**: Deployed on Vercel with automatic deployments
- **Smart Contract**: Already deployed on Reef Pelagia
- **Environment**: Uses Railway.json and Vercel.json for platform-specific configs

## Known Issues & Limitations

### Current Limitations
- No local smart contract development setup
- Limited test coverage
- Simplified wallet integration (no full RainbowKit implementation)
- Some UI features are placeholder (swap, fiat funding)

### Development Notes
- The smart contract is already deployed; focus development on frontend
- Pool data is fetched directly from blockchain (no caching layer)
- UI is mobile-first design with responsive layout
- Uses custom color scheme with blue/teal accent colors