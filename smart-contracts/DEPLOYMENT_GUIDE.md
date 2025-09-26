# Deploy SecurePool Contract

## 🚀 Quick Deployment Steps

### Step 1: Setup Environment
```bash
cd smart-contracts
cp .env.example .env
```

### Step 2: Edit .env File
Add your private key to the `.env` file:
```bash
REEF_PELAGIA_RPC_URL=http://34.123.142.246:8545
PRIVATE_KEY=your_private_key_here
```

### Step 3: Deploy Contract
```bash
npx hardhat run scripts/deploy-secure-pool.js --network reefPelagia
```

### Step 4: Update Frontend
After deployment, copy the contract address and update `frontend/.env.local`:
```bash
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_REEF_RPC_URL=http://34.123.142.246:8545
NEXT_PUBLIC_REEF_CHAIN_ID=13939
```

### Step 5: Restart Frontend
```bash
cd frontend
npm run dev
```

## 🔧 Alternative: Deploy with Remix

If Hardhat doesn't work:

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create `SecurePool.sol` file
3. Copy the contract code from `contracts/SecurePool.sol`
4. Compile and deploy to Reef Pelagia
5. Copy the contract address
6. Update frontend environment variables
