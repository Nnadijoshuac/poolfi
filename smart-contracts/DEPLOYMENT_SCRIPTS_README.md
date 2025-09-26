# PoolFi Smart Contract Deployment Scripts

This directory contains ethers.js deployment scripts for deploying PoolFi smart contracts to the Reef Pelagia testnet.

## 📋 Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Sufficient REEF tokens for gas fees (at least 0.05 ETH worth)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install ethers.js
npm install ethers@^5.7.2

# Or use the provided package file
npm install --package-lock-only --package-lock=package-deploy.json
```

### 2. Deploy All Contracts

```bash
# Deploy all 5 contracts in sequence
node deployAll.js
```

### 3. Deploy Individual Contracts

```bash
# Deploy MockREEF token
node deployMockReef.js

# Deploy BasicPool
node deployBasicPool.js

# Deploy MinimalPool
node deployMinimalPool.js

# Deploy PoolManager
node deployPoolManager.js

# Deploy SimplePoolManager
node deploySimplePoolManager.js
```

## 📁 Generated Files

After deployment, the following files will be created:

- `deployment-report.json` - Comprehensive deployment report
- `deployed-addresses.json` - Simple contract addresses mapping
- `deployment-{contractname}.json` - Individual contract deployment info

## 🔧 Configuration

The deployment scripts use the following configuration:

- **RPC URL**: `http://34.123.142.246:8545`
- **Chain ID**: `13939`
- **Network**: Reef Pelagia Testnet
- **Private Key**: `0x7849a701ec1c1775c653867ce7c41f54c99c096e7818fdf134931fd4796d1186`

## 📊 Contract Details

### 1. MockREEF
- **Purpose**: Mock REEF token for testing
- **Features**: Faucet functionality, minting, pausable
- **Constructor**: No parameters

### 2. BasicPool
- **Purpose**: Simplified collaborative savings pool
- **Features**: Basic pool creation, joining, contributions
- **Constructor**: No parameters

### 3. MinimalPool
- **Purpose**: Ultra-lightweight pool contract
- **Features**: Minimal gas usage, core functionality
- **Constructor**: No parameters

### 4. PoolManager
- **Purpose**: Full-featured pool management system
- **Features**: Advanced features, platform fees, pausable
- **Constructor**: No parameters

### 5. SimplePoolManager
- **Purpose**: Basic pool management
- **Features**: Simple pool operations
- **Constructor**: No parameters

## 🛠️ Troubleshooting

### Common Issues

1. **Insufficient Balance**
   - Ensure you have enough REEF tokens for gas fees
   - Minimum recommended: 0.05 ETH worth

2. **Network Connection Issues**
   - Check if the RPC endpoint is accessible
   - Verify the chain ID is correct

3. **Contract Deployment Fails**
   - Check the error message in the console
   - Verify the contract artifacts exist
   - Ensure the private key has sufficient permissions

### Error Codes

- `INSUFFICIENT_BALANCE`: Not enough REEF for gas fees
- `NETWORK_ERROR`: RPC connection issues
- `CONTRACT_ERROR`: Contract deployment failed
- `ARTIFACT_ERROR`: Contract artifact not found

## 📝 Example Usage

```javascript
const { deployAllContracts } = require('./deployAll');

async function main() {
    try {
        const results = await deployAllContracts();
        console.log('Deployment completed:', results);
    } catch (error) {
        console.error('Deployment failed:', error);
    }
}

main();
```

## 🔍 Verification

After deployment, you can verify contracts by:

1. Checking the deployment report
2. Calling contract functions to verify state
3. Using a block explorer (if available for Reef Pelagia)

## 📞 Support

For issues or questions:
1. Check the console output for detailed error messages
2. Review the deployment report JSON file
3. Ensure all prerequisites are met

## 🎯 Next Steps

After successful deployment:
1. Update your frontend configuration with the new contract addresses
2. Test the contracts with sample transactions
3. Deploy to mainnet when ready (update RPC URL and chain ID)

---

**Note**: These scripts are configured for the Reef Pelagia testnet. For mainnet deployment, update the RPC URL, chain ID, and ensure you have the correct private key and sufficient funds.
