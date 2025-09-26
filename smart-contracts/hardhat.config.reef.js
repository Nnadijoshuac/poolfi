require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
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
    reefPelagia: {
      url: process.env.REEF_PELAGIA_RPC_URL || "http://34.123.142.246:8545",
      chainId: 13939,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    reefTestnet: {
      url: process.env.REEF_TESTNET_RPC_URL || "https://rpc.reefscan.com",
      chainId: 13940,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
  },
};
