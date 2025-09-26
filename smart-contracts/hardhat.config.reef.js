require('@nomicfoundation/hardhat-toolbox');

// ✅ Private key for Reef Pelagia testnet
const PRIVATE_KEY = "0x7849a701ec1c1775c653867ce7c41f54c99c096e7818fdf134931fd4796d1186";

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "london", // Specify EVM version for Reef compatibility
    },
  },
  networks: {
    hardhat: {
      // Standard hardhat network
    },
    reefPelagia: {
      url: "http://34.123.142.246:8545",
      accounts: [PRIVATE_KEY],
      chainId: 13939,
      gasPrice: 1000000000, // 1 gwei
      gas: 8000000, // Increase gas limit
      timeout: 300000, // 5 minutes
      httpHeaders: {},
      // Reef-specific settings
      allowUnlimitedContractSize: true,
      blockGasLimit: 8000000,
    },
    // Alternative Reef Pelagia configuration
    reefPelagiaAlt: {
      url: "http://34.123.142.246:8545",
      accounts: [PRIVATE_KEY],
      chainId: 13939,
      gasPrice: 0, // Try with 0 gas price
      gas: 8000000,
      timeout: 300000,
      httpHeaders: {},
      allowUnlimitedContractSize: true,
    },
  },
  // Add paths configuration
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
