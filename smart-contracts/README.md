# PoolFi Smart Contracts

A comprehensive collaborative savings platform built on the Reef Network. This repository contains the smart contracts that power PoolFi, allowing users to create and join savings pools for collective financial goals.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Contracts](#contracts)
- [Installation](#installation)
- [Deployment](#deployment)
- [Testing](#testing)
- [Usage](#usage)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

PoolFi is a decentralized collaborative savings platform that enables groups of people to collectively save towards common financial goals. Built on the Reef Network, it provides a secure, transparent, and efficient way for communities to pool their resources.

### Key Features

- **Pool Creation**: Create savings pools with customizable parameters
- **Member Management**: Join pools and track member contributions
- **Contribution System**: Make fixed-amount contributions to pools
- **Automatic Completion**: Pools automatically complete when targets are reached
- **Fund Withdrawal**: Members can withdraw their contributions from completed pools
- **Platform Fees**: Configurable platform fees for sustainability
- **Emergency Controls**: Pause/unpause functionality for emergency situations

## 🏗️ Architecture

The PoolFi smart contract system consists of multiple contracts designed for different use cases:

```
PoolFi Smart Contract System
├── PoolManager.sol      # Main contract with full functionality
├── BasicPool.sol        # Simplified version for testing
├── MinimalPool.sol      # Ultra-lightweight version
└── MockREEF.sol         # Mock token for testing
```

## 📄 Contracts

### PoolManager.sol

The main contract that manages all savings pools with comprehensive features:

**Key Features:**
- Pool creation and management
- Member joining and tracking
- Contribution handling
- Fund withdrawal
- Platform fee management
- Emergency controls
- User pool tracking

**Functions:**
- `createPool()` - Create a new savings pool
- `joinPool()` - Join an existing pool
- `contribute()` - Make a contribution to a pool
- `withdrawFunds()` - Withdraw funds from completed pool
- `getPoolInfo()` - Get detailed pool information
- `getUserPools()` - Get pools created by a user
- `getUserMemberships()` - Get pools where user is a member

### BasicPool.sol

A simplified version of PoolManager optimized for testing and gas efficiency:

**Features:**
- Core pool functionality
- Simplified structure
- Lower gas costs
- Essential security features

### MinimalPool.sol

An ultra-lightweight version for minimal deployments:

**Features:**
- Minimal gas usage
- Core functionality only
- Fast deployment
- Basic security

### MockREEF.sol

A mock REEF token for testing purposes:

**Features:**
- ERC20 standard implementation
- Faucet functionality
- Daily limits
- Pausable transfers
- Testing utilities

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat
- Git

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd poolfi/smart-contracts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PRIVATE_KEY=your_private_key_here
   REEF_RPC_URL=https://rpc.reefscan.com
   REEF_CHAIN_ID=13939
   ```

## 🚀 Deployment

### Deploy to Reef Network

1. **Compile contracts:**
   ```bash
   npm run compile
   ```

2. **Run tests:**
   ```bash
   npm test
   ```

3. **Deploy to Reef Pelagia testnet:**
   ```bash
   npm run deploy:pelagia
   ```

4. **Deploy to Reef mainnet:**
   ```bash
   npm run deploy:mainnet
   ```

### Deployment Scripts

- `deploy.js` - Deploy all contracts
- `deploy-basic.js` - Deploy BasicPool only
- `deploy-minimal.js` - Deploy MinimalPool only
- `deploy-reef.js` - Deploy MockREEF token

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/PoolManager.test.js

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run tests with coverage
npx hardhat coverage
```

### Test Coverage

The test suite covers:
- Contract deployment
- Pool creation and management
- Member joining and leaving
- Contribution handling
- Fund withdrawal
- Admin functions
- Edge cases and error conditions
- Gas optimization

## 📖 Usage

### Creating a Pool

```solidity
// Create a new savings pool
uint256 poolId = await poolManager.createPool(
    "Vacation Fund",           // Pool name
    "Saving for summer trip",  // Description
    ethers.parseEther("100"),  // Target amount (100 REEF)
    ethers.parseEther("10"),   // Contribution amount (10 REEF)
    10,                        // Max members
    deadline                   // Deadline timestamp
);
```

### Joining a Pool

```solidity
// Join an existing pool
await poolManager.joinPool(poolId);
```

### Making a Contribution

```solidity
// Make a contribution (must be exact amount)
await poolManager.contribute(poolId, { 
    value: ethers.parseEther("10") 
});
```

### Withdrawing Funds

```solidity
// Withdraw funds from completed pool
await poolManager.withdrawFunds(poolId);
```

## 🔒 Security

### Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Ownable**: Access control for admin functions
- **Pausable**: Emergency pause functionality
- **Input Validation**: Comprehensive parameter validation
- **Access Control**: Role-based permissions
- **Safe Math**: Overflow/underflow protection

### Security Considerations

- All external calls are protected with ReentrancyGuard
- Input validation prevents invalid operations
- Access control ensures only authorized users can perform sensitive operations
- Emergency pause allows quick response to security issues
- Platform fees are capped to prevent excessive charges

### Audit Recommendations

Before mainnet deployment, consider:
- Professional security audit
- Formal verification
- Bug bounty program
- Community review

## 📊 Gas Optimization

### Optimizations Implemented

- Packed structs for efficient storage
- Batch operations where possible
- Minimal external calls
- Efficient event logging
- Optimized loops and conditions

### Gas Usage Estimates

| Function | Gas Cost (approx.) |
|----------|-------------------|
| createPool | 180,000 |
| joinPool | 45,000 |
| contribute | 35,000 |
| withdrawFunds | 30,000 |

## 🔧 Configuration

### Network Configuration

The contracts are configured for Reef Network:

- **Mainnet**: Chain ID 13939
- **Testnet**: Chain ID 13940
- **Pelagia**: Chain ID 13939 (testnet)

### Hardhat Configuration

```javascript
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    reefMainnet: {
      url: "https://rpc.reefscan.com",
      chainId: 13939,
      accounts: [process.env.PRIVATE_KEY],
    },
    // ... other networks
  },
};
```

## 📈 Monitoring

### Events

All major operations emit events for monitoring:

- `PoolCreated` - When a new pool is created
- `MemberJoined` - When a user joins a pool
- `ContributionMade` - When a contribution is made
- `PoolCompleted` - When a pool reaches its target
- `FundsWithdrawn` - When funds are withdrawn

### Analytics

Track important metrics:
- Total pools created
- Total value locked
- Active users
- Platform fees collected
- Gas usage patterns

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Style

- Follow Solidity style guide
- Use meaningful variable names
- Add comprehensive comments
- Include NatSpec documentation
- Write tests for all functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- Check the [documentation](docs/)
- Review [FAQ](docs/FAQ.md)
- Join our [Discord](https://discord.gg/poolfi)
- Open an [issue](https://github.com/poolfi/issues)

### Reporting Issues

When reporting issues, please include:
- Contract version
- Network details
- Steps to reproduce
- Expected vs actual behavior
- Transaction hashes (if applicable)

## 🔗 Links

- [Website](https://poolfi.com)
- [Documentation](https://docs.poolfi.com)
- [Discord](https://discord.gg/poolfi)
- [Twitter](https://twitter.com/poolfi)
- [GitHub](https://github.com/poolfi)

---

**⚠️ Disclaimer**: This software is provided as-is. Use at your own risk. Always conduct thorough testing before deploying to mainnet.
