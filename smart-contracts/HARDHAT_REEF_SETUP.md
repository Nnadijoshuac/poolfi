# Hardhat with Reef Pelagia Setup

This document explains how to use Hardhat with Reef Pelagia testnet for PoolFi smart contract development.

## Overview

This setup provides:
- Hardhat development environment for Solidity contracts
- Reef Pelagia testnet deployment configuration
- Ignition deployment modules for safe contract deployment
- Interaction scripts for testing deployed contracts

## Prerequisites

- Node.js (v16.0.0 or later) - Consider using Node.js 22.18+ and npm 10.9.0+
- REEF test tokens for transaction fees
- Basic understanding of Solidity programming

## Configuration

### Networks Available

1. **reefPelagiaTestnet**: Reef Pelagia testnet (recommended for testing)
   - URL: `http://34.123.142.246:8545`
   - Chain ID: 13939

2. **reefPelagia**: Reef Pelagia mainnet
   - URL: `http://34.123.142.246:8545`
   - Chain ID: 13939

3. **reefTestnet**: Reef testnet
   - URL: `https://rpc-testnet.reefscan.com`
   - Chain ID: 13940

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the smart-contracts directory:

```bash
PRIVATE_KEY=your_private_key_here
```

Or use Hardhat's secure variable storage:

```bash
npx hardhat vars set PRIVATE_KEY "your_private_key_here"
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Run Tests

```bash
npm run test
```

## Deployment

### Using Ignition (Recommended)

Deploy contracts using Ignition modules:

```bash
# Deploy PoolManager with MockREEF token
npm run deploy:pelagia-poolmanager

# Deploy SimplePoolManager with MockREEF token
npm run deploy:pelagia-simple

# Deploy BasicPool with MockREEF token
npm run deploy:pelagia-basic
```

### Using Traditional Scripts

```bash
# Deploy using existing scripts
npm run deploy:pelagia
npm run deploy:simple
```

## Contract Interaction

After deployment, use the interaction script to test your contracts:

1. Update the contract addresses in `scripts/interact.js`
2. Run the interaction script:

```bash
npx hardhat run scripts/interact.js --network reefPelagiaTestnet
```

## Available Scripts

- `npm run compile` - Compile contracts
- `npm run test` - Run tests
- `npm run deploy:pelagia-poolmanager` - Deploy PoolManager using Ignition
- `npm run deploy:pelagia-simple` - Deploy SimplePoolManager using Ignition
- `npm run deploy:pelagia-basic` - Deploy BasicPool using Ignition
- `npm run deploy:pelagia` - Deploy using traditional scripts
- `npm run node` - Start local Hardhat node

## Contract Verification

Use the Reef Pelagia testnet verifier to verify your smart contracts:

https://testnet-sc-verifier-dmxrcv-2e0f9f-72-60-35-83.traefik.me/api/v2/verifier/solidity/versions

## Important Notes

1. **Code Blob Size**: Reef Pelagia supports up to 100KB contract code blob size (vs Ethereum's 24KB limit)

2. **Gas Fees**: Ensure you have enough REEF tokens to cover deployment and transaction fees

3. **Network Configuration**: The configuration is set up for Reef Pelagia testnet by default

4. **Windows Compatibility**: The PolkaVM plugin has some Windows compatibility issues, so we're using standard Solidity compilation

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Clean and reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Deployment failures**: Check your private key and ensure you have enough REEF tokens

3. **Network connection issues**: Verify the RPC URL is accessible

### Getting Help

- Check the [Reef documentation](https://docs.reefscan.com/)
- Review the [Hardhat documentation](https://hardhat.org/docs)
- Contact the PoolFi team for assistance

## File Structure

```
smart-contracts/
├── contracts/           # Solidity contracts
├── ignition/           # Ignition deployment modules
│   └── modules/        # Deployment scripts
├── scripts/            # Interaction scripts
├── test/              # Test files
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Dependencies and scripts
```
