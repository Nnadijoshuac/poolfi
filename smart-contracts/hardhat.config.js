require('@nomicfoundation/hardhat-toolbox');
// require('@parity/hardhat-polkadot'); // Commented out due to Windows compatibility issues

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
      timeout: 300000, // 5 minutes
      httpHeaders: {},
    },
  },
};
