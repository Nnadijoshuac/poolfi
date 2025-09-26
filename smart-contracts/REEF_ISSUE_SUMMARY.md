# Reef Pelagia Deployment Issue - Simple Summary

## 🚨 **Problem**
Getting `CodeRejected` error when deploying contracts to Reef Pelagia testnet. All contracts work perfectly on local Hardhat network.

## 🔍 **Error Details**
```
Failed to instantiate contract: Module(ModuleError { index: 54, error: [27, 0, 0, 0], message: Some("CodeRejected") })
```

## 📋 **What We're Trying to Deploy**
5 simple contracts:
1. **MockREEF** - ERC20 token
2. **BasicPool** - Savings pool
3. **MinimalPool** - Lightweight pool
4. **PoolManager** - Pool management
5. **SimplePoolManager** - Basic pool

## 🧪 **Quick Test Script**
```bash
# Test the issue
npx hardhat run scripts/reef-debug-test.js --network reefPelagia
```

## ⚙️ **Configuration**
```javascript
// hardhat.config.js
module.exports = {
  solidity: "0.8.20",
  networks: {
    reefPelagia: {
      url: "http://34.123.142.246:8545",
      accounts: ["0x7849a701ec1c1775c653867ce7c41f54c99c096e7818fdf134931fd4796d1186"],
      chainId: 13939,
    },
  },
};
```

## ❓ **Questions for Reef Team**
1. Which contract types does Revive pallet currently support?
2. Are OpenZeppelin contracts whitelisted?
3. What are the current limitations?
4. Timeline for full support?

## 📁 **Files to Test**
- `contracts/MockREEF.sol` - Simplest contract
- `contracts/MinimalTest.sol` - Ultra-minimal test
- `scripts/reef-debug-test.js` - Test script

**Account**: `0xC528958E75E81dc396c8f1E66A69ba5a0312763b` (has 10,000 ETH)
