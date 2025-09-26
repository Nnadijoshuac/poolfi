# Reef Pelagia Debug Package - PoolFi Smart Contracts

## 🚨 **Issue Summary**
- **Error**: `CodeRejected` during contract deployment on Reef Pelagia testnet
- **Cause**: Revive pallet in development phase - may not support all contract types
- **Status**: All contracts work perfectly on local Hardhat network

## 📋 **Contract Details**

### **5 Contracts to Deploy:**
1. **MockREEF** - ERC20 token with faucet functionality
2. **BasicPool** - Full-featured collaborative savings pool
3. **MinimalPool** - Lightweight pool implementation  
4. **PoolManager** - Advanced pool management with fees
5. **SimplePoolManager** - Basic pool functionality

### **Contract Dependencies:**
- **OpenZeppelin Contracts v5.4.0**:
  - `@openzeppelin/contracts/token/ERC20/ERC20.sol`
  - `@openzeppelin/contracts/access/Ownable.sol`
  - `@openzeppelin/contracts/utils/ReentrancyGuard.sol`
  - `@openzeppelin/contracts/utils/Pausable.sol`
  - `@openzeppelin/contracts/utils/Context.sol`

### **Solidity Version:** 0.8.20

## 🔧 **Deployment Configuration**

### **Hardhat Config:**
```javascript
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "london",
    },
  },
  networks: {
    reefPelagia: {
      url: "http://34.123.142.246:8545",
      accounts: ["0x7849a701ec1c1775c653867ce7c41f54c99c096e7818fdf134931fd4796d1186"],
      chainId: 13939,
      gasPrice: 1000000000,
      gas: 8000000,
      timeout: 300000,
      httpHeaders: {},
      allowUnlimitedContractSize: true,
      blockGasLimit: 8000000,
    },
  },
};
```

## 🚀 **Reproduction Steps**

### **1. Setup Environment:**
```bash
# Install dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts@5.4.0

# Compile contracts
npx hardhat compile
```

### **2. Test Deployment:**
```bash
# Deploy all contracts
npx hardhat run scripts/deployAll.js --network reefPelagia

# Or deploy single contract for testing
npx hardhat run scripts/deployReefSimple.js --config hardhat.config.reef.js --network reefPelagia
```

### **3. Expected Error:**
```
Failed to instantiate contract: Module(ModuleError { index: 54, error: [27, 0, 0, 0], message: Some("CodeRejected") })
```

## 📁 **Contract Files Location**
- **Main Contracts**: `smart-contracts/contracts/`
- **Deployment Scripts**: `smart-contracts/scripts/`
- **Configuration**: `smart-contracts/hardhat.config.reef.js`

## 🔍 **Specific Questions for Reef Team**

1. **Which contract types are currently supported** by the Revive pallet?
2. **Are OpenZeppelin contracts whitelisted** for deployment?
3. **What are the current limitations** of the Revive pallet?
4. **Is there a timeline** for full contract support?
5. **Are there alternative deployment methods** we should use?

## ✅ **Verification**
- All contracts work perfectly on local Hardhat network
- Compilation succeeds without errors
- Contract logic is standard and well-tested
- Error occurs consistently across all contract types

## 📞 **Contact**
- **Project**: PoolFi - Collaborative Savings Platform
- **Network**: Reef Pelagia Testnet
- **Account**: 0xC528958E75E81dc396c8f1E66A69ba5a0312763b
