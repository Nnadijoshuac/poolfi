# PoolFi Smart Contracts

This directory contains the smart contracts for the PoolFi decentralized savings platform.

## Contract

- **PoolFi.sol** - Main smart contract deployed on Reef Pelagia network
  - Address: `0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47`
  - Network: Reef Pelagia (Chain ID: 13939)
  - Features: Pool creation, contributions, withdrawals, and management

## Deployment

The contract is already deployed and integrated with the frontend. No additional deployment steps are required.

## Contract Functions

### Core Functions
- `createPool()` - Create a new savings pool
- `contribute()` - Contribute to a pool
- `withdraw()` - Withdraw from a completed pool
- `cancelPool()` - Cancel a pool after deadline

### View Functions
- `getPoolBasicInfo()` - Get basic pool information
- `getPoolFinancialInfo()` - Get financial details
- `getPoolMemberInfo()` - Get member information
- `getUserPools()` - Get user's pools
- `hasUserContributed()` - Check if user contributed

## Events

- `PoolCreated` - Emitted when a pool is created
- `ContributionMade` - Emitted when someone contributes
- `PoolCompleted` - Emitted when pool reaches target
- `FundsWithdrawn` - Emitted when funds are withdrawn