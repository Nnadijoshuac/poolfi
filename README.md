# PoolFi - Reef Savings Platform

A decentralized savings platform built on Reef blockchain that allows users to create, join, and manage savings pools with friends and family.

## 🌊 Built for Reef Ecosystem

This project is specifically designed for the Reef blockchain ecosystem, featuring:
- **Reef Pelagia Network** support
- **REEF token** integration
- **Reef-specific** wallet connections
- **Optimized** for Reef's EVM compatibility

## 🚀 Features

### Core Functionality
- **Create Savings Pools**: Set target amounts, deadlines, and member limits
- **Join & Contribute**: Atomic join and contribute operations
- **Pool Management**: Cancel pools after deadline if target not met
- **Withdraw Funds**: Withdraw contributions after pool completion or cancellation
- **Real-time Tracking**: Live blockchain event monitoring

### Security Features
- **Atomic Operations**: Prevents front-running attacks
- **Smart Contract Security**: Audited contract patterns
- **Withdrawal Protection**: Safe fund recovery mechanisms

### User Experience
- **Modern UI**: Built with Next.js and Tailwind CSS
- **Wallet Integration**: RainbowKit and WalletConnect support
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live activity tracking

## 🏗️ Architecture

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Wallet**: RainbowKit + WalletConnect
- **Blockchain**: Wagmi + Viem
- **State Management**: React hooks

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Network**: Reef Pelagia (Chain ID: 13939)
- **Features**: Gas-optimized, event-driven

## 📁 Project Structure

```
poolfi/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── public/             # Static assets
├── smart-contracts/        # Solidity smart contracts
│   ├── contracts/          # Contract source files
│   ├── scripts/            # Deployment scripts
│   └── test/               # Contract tests
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask wallet
- REEF tokens (for testing)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Smart Contract Setup
```bash
cd smart-contracts
npm install
npx hardhat compile
```

## 🌐 Network Configuration

### Reef Pelagia (Development)
- **RPC URL**: `http://34.123.142.246:8545`
- **Chain ID**: `13939`
- **Currency**: REEF
- **Explorer**: `https://dev.papi.how/explorer`

### Adding to MetaMask
1. Open MetaMask
2. Add Custom Network
3. Enter the network details above
4. Save and switch to Reef Pelagia

## 🔧 Environment Variables

Create `.env.local` in the frontend directory:

```bash
# Smart Contract Address (after deployment)
NEXT_PUBLIC_POOL_MANAGER_ADDRESS=0x...

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Reef Network Configuration
NEXT_PUBLIC_REEF_RPC_URL=http://34.123.142.246:8545
NEXT_PUBLIC_REEF_CHAIN_ID=13939
```

## 📱 Usage

### Creating a Pool
1. Connect your wallet
2. Click "Create Pool"
3. Set target amount, deadline, and max members
4. Confirm transaction

### Joining a Pool
1. Browse available pools
2. Click "Join Pool"
3. Enter contribution amount
4. Confirm transaction

### Managing Pools
- View pool details
- Track contributions
- Withdraw funds when eligible

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Smart Contract Development
```bash
cd smart-contracts
npx hardhat compile  # Compile contracts
npx hardhat test     # Run tests
npx hardhat deploy   # Deploy contracts
```

## 🧪 Testing

### Frontend Testing
- Manual testing with MetaMask
- Wallet connection testing
- UI/UX validation

### Smart Contract Testing
- Unit tests for all functions
- Event emission testing
- Edge case validation

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
npm run deploy:vercel
```

### Smart Contract (Reef Pelagia)
1. Deploy using Remix IDE
2. Verify contract on explorer
3. Update frontend environment variables

## 🔒 Security Considerations

- **Private Key Security**: Never commit private keys
- **Contract Verification**: Verify all deployed contracts
- **Access Control**: Proper permission management
- **Input Validation**: Comprehensive input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Hackathon Submission

This project was built for the Reef hackathon, showcasing:
- **Reef Ecosystem Integration**
- **Innovative Savings Platform**
- **User-Friendly Interface**
- **Secure Smart Contracts**

## 📞 Support

For questions or support:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Reef Ecosystem**