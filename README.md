# PoolFi - Collaborative Savings Platform

A decentralized savings platform built on Reef Network that allows users to create and join collaborative savings pools.

## 📁 Project Structure

```
poolfi/
├── frontend/                 # Next.js Frontend Application
│   ├── app/                 # Next.js App Router
│   ├── components/          # React Components
│   ├── hooks/              # Custom React Hooks
│   ├── public/             # Static Assets
│   ├── package.json        # Frontend Dependencies
│   └── ...
├── smart-contracts/        # Solidity Smart Contracts
│   ├── contracts/          # Solidity Contract Files
│   ├── scripts/            # Deployment Scripts
│   ├── hardhat.config.js   # Hardhat Configuration
│   ├── package.json        # Smart Contract Dependencies
│   └── ...
└── README.md               # This File
```

## 🚀 Quick Start

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3001`

### Smart Contract Development

```bash
cd smart-contracts
npm install
npm run compile
npm run deploy:pelagia
```

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, Wagmi v2, RainbowKit
- **Smart Contracts**: Solidity with OpenZeppelin, Hardhat
- **Network**: Reef Pelagia Testnet (Chain ID: 13939)

## 📱 Features

- Create collaborative savings pools
- Join existing pools
- Real-time pool management
- Wallet integration with Reef Network
- Mobile-first responsive design

## 🌐 Network Configuration

- **Reef Pelagia Testnet**: `http://34.123.142.246:8545`
- **Chain ID**: 13939
- **Currency**: REEF

## 🎯 Web3Conf Enugu

This project was built for Web3Conf Enugu 2024, showcasing DeFi innovation on the Reef Network.

## 📄 License

MIT License - see LICENSE file for details
