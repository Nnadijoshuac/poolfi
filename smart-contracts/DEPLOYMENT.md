# PoolFi Smart Contract Deployment Guide

This guide provides comprehensive instructions for deploying PoolFi smart contracts to the Reef Network.

## 📋 Prerequisites

### Required Software
- Node.js (v16 or higher)
- npm or yarn
- Git
- A Reef Network wallet with REEF tokens

### Required Knowledge
- Basic understanding of blockchain and smart contracts
- Familiarity with command line interface
- Understanding of gas fees and transaction costs

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
cd smart-contracts
npm install
```

### 2. Environment Configuration

Create a `.env` file in the smart-contracts directory:

```env
# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Reef Network RPC URLs
REEF_RPC_URL=https://rpc.reefscan.com
REEF_PELAGIA_URL=http://34.123.142.246:8545
REEF_TESTNET_URL=https://rpc-testnet.reefscan.com

# Network Configuration
REEF_CHAIN_ID=13939
REEF_TESTNET_CHAIN_ID=13940
```

### 3. Get REEF Tokens

For testing and deployment, you'll need REEF tokens:

**Testnet Faucets:**
- Reef Pelagia: https://faucet.reefscan.com/
- Reef Testnet: https://faucet.reefscan.com/

**Mainnet:**
- Purchase from exchanges like Binance, KuCoin, etc.

## 🚀 Deployment Options

### Option 1: Deploy All Contracts (Recommended)

Deploy all contracts including PoolManager, BasicPool, MinimalPool, and MockREEF:

```bash
# Deploy to Reef Pelagia testnet
npm run deploy:pelagia

# Deploy to Reef mainnet
npm run deploy:mainnet

# Deploy to Reef testnet
npm run deploy:testnet
```

### Option 2: Deploy Individual Contracts

Deploy specific contracts based on your needs:

```bash
# Deploy only PoolManager
npx hardhat run scripts/deploy.js --network reefPelagia

# Deploy only BasicPool
npx hardhat run scripts/deploy-basic.js --network reefPelagia

# Deploy only MinimalPool
npx hardhat run scripts/deploy-minimal.js --network reefPelagia

# Deploy only MockREEF
npx hardhat run scripts/deploy-reef.js --network reefPelagia
```

## 📊 Deployment Process

### Step 1: Compile Contracts

```bash
npm run compile
```

This will:
- Compile all Solidity contracts
- Generate ABI files
- Create bytecode artifacts
- Check for compilation errors

### Step 2: Run Tests

```bash
npm test
```

Ensure all tests pass before deployment:
- Unit tests for all contracts
- Integration tests
- Edge case testing
- Gas optimization verification

### Step 3: Deploy Contracts

```bash
# For testnet deployment
npm run deploy:pelagia
```

The deployment script will:
1. Check your account balance
2. Deploy contracts in sequence
3. Verify deployments
4. Test basic functionality
5. Save deployment information

### Step 4: Verify Deployment

After deployment, verify the contracts:

```bash
# Check contract addresses
cat deployment-info.json

# Verify on ReefScan
# Visit: https://reefscan.com
# Search for your contract addresses
```

## 🔍 Post-Deployment Verification

### 1. Contract Verification

Verify contracts on ReefScan for transparency:

```bash
# Verify PoolManager
npx hardhat verify --network reefPelagia <POOL_MANAGER_ADDRESS>

# Verify BasicPool
npx hardhat verify --network reefPelagia <BASIC_POOL_ADDRESS>

# Verify MinimalPool
npx hardhat verify --network reefPelagia <MINIMAL_POOL_ADDRESS>

# Verify MockREEF
npx hardhat verify --network reefPelagia <MOCK_REEF_ADDRESS>
```

### 2. Test Contract Functions

Test basic functionality after deployment:

```javascript
// Example: Create a test pool
const poolManager = await ethers.getContractAt("PoolManager", POOL_MANAGER_ADDRESS);

const deadline = Math.floor(Date.now() / 1000) + 86400;
const tx = await poolManager.createPool(
    "Test Pool",
    "Testing deployment",
    ethers.parseEther("10"),
    ethers.parseEther("1"),
    5,
    deadline
);
await tx.wait();
```

### 3. Update Frontend Configuration

Update your frontend environment variables:

```env
# Add to frontend/.env.local
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_BASIC_POOL_ADDRESS=0x...
NEXT_PUBLIC_MINIMAL_POOL_ADDRESS=0x...
NEXT_PUBLIC_MOCK_REEF_ADDRESS=0x...
```

## 🌐 Network-Specific Instructions

### Reef Pelagia Testnet

**Network Details:**
- Chain ID: 13939
- RPC URL: http://34.123.142.246:8545
- Block Explorer: https://pelagia.reefscan.com

**Deployment:**
```bash
npm run deploy:pelagia
```

### Reef Mainnet

**Network Details:**
- Chain ID: 13939
- RPC URL: https://rpc.reefscan.com
- Block Explorer: https://reefscan.com

**Deployment:**
```bash
npm run deploy:mainnet
```

**⚠️ Important:** Test thoroughly on testnet before mainnet deployment!

### Reef Testnet

**Network Details:**
- Chain ID: 13940
- RPC URL: https://rpc-testnet.reefscan.com
- Block Explorer: https://testnet.reefscan.com

**Deployment:**
```bash
npm run deploy:testnet
```

## 🔧 Configuration Management

### Gas Configuration

Adjust gas settings in `hardhat.config.js`:

```javascript
networks: {
  reefPelagia: {
    url: "http://34.123.142.246:8545",
    chainId: 13939,
    accounts: [process.env.PRIVATE_KEY],
    gasPrice: 1000000000, // 1 gwei
    gas: 5000000, // 5M gas limit
    timeout: 120000, // 2 minutes
  }
}
```

### Solidity Compiler Settings

Optimize for gas efficiency:

```javascript
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200, // Optimize for 200 function calls
    },
  },
}
```

## 🚨 Troubleshooting

### Common Issues

**1. Insufficient Funds**
```
Error: insufficient funds for gas
```
**Solution:** Get REEF tokens from faucet or exchange

**2. Gas Limit Exceeded**
```
Error: gas limit exceeded
```
**Solution:** Increase gas limit in hardhat.config.js

**3. Network Timeout**
```
Error: timeout
```
**Solution:** Increase timeout or try again later

**4. Nonce Issues**
```
Error: nonce too low
```
**Solution:** Wait a moment and retry

### Debug Commands

```bash
# Check account balance
npx hardhat run scripts/check-balance.js --network reefPelagia

# Check network connection
npx hardhat run scripts/check-network.js --network reefPelagia

# Verify contract bytecode
npx hardhat run scripts/verify-bytecode.js --network reefPelagia
```

## 📈 Monitoring and Maintenance

### Contract Monitoring

Monitor your deployed contracts:

1. **ReefScan Explorer**
   - Track transactions
   - Monitor contract interactions
   - View contract source code

2. **Event Monitoring**
   - Set up alerts for important events
   - Monitor pool creation and completion
   - Track fund movements

3. **Gas Usage**
   - Monitor gas consumption
   - Optimize for cost efficiency
   - Track user transaction costs

### Maintenance Tasks

**Regular Maintenance:**
- Monitor contract health
- Update documentation
- Review security best practices
- Backup important data

**Emergency Procedures:**
- Pause contracts if needed
- Emergency fund withdrawal
- Contract upgrades (if applicable)

## 🔒 Security Considerations

### Pre-Deployment Security

- [ ] Code review completed
- [ ] Tests pass with 100% coverage
- [ ] Security audit (if applicable)
- [ ] Gas optimization verified
- [ ] Access control tested

### Post-Deployment Security

- [ ] Monitor for unusual activity
- [ ] Regular security updates
- [ ] Emergency response plan
- [ ] Backup and recovery procedures

## 📞 Support

### Getting Help

- **Documentation**: Check README.md and this guide
- **Issues**: Open GitHub issues for bugs
- **Discord**: Join our community Discord
- **Email**: Contact support@poolfi.com

### Emergency Contacts

- **Security Issues**: security@poolfi.com
- **Technical Support**: support@poolfi.com
- **Business Inquiries**: business@poolfi.com

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Environment configured
- [ ] Dependencies installed
- [ ] Tests passing
- [ ] Contracts compiled
- [ ] REEF tokens available
- [ ] Network connection verified

### During Deployment
- [ ] Monitor deployment progress
- [ ] Check for errors
- [ ] Verify contract addresses
- [ ] Test basic functionality

### Post-Deployment
- [ ] Verify contracts on explorer
- [ ] Update frontend configuration
- [ ] Test all functions
- [ ] Monitor for issues
- [ ] Document deployment info

---

**🎉 Congratulations!** Your PoolFi smart contracts are now deployed and ready for use. Remember to test thoroughly and monitor the contracts for optimal performance.