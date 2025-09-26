# PoolFi - Collaborative Savings Platform

A decentralized collaborative savings platform built on the Reef Network, enabling users to create and join savings pools with friends, family, or communities.

## 🌟 Features

### Core Functionality
- **Create Pools**: Set up collaborative savings pools with custom parameters
- **Join Pools**: Become a member of existing pools
- **Make Contributions**: Contribute REEF tokens to pools
- **Track Progress**: Monitor pool progress and member activities
- **Real-time Updates**: Live activity feed and notifications

### Technical Features
- **Multi-wallet Support**: MetaMask, WalletConnect, and more
- **Reef Network Integration**: Built specifically for Reef blockchain
- **Responsive Design**: Works on desktop and mobile
- **Real-time Data**: Live blockchain event tracking
- **Secure**: Smart contract-based, no central authority

## 🏗 Project Structure

```
poolfi/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js 14 App Router
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   └── public/             # Static assets
├── smart-contracts/         # Solidity smart contracts
│   ├── contracts/          # Contract source code
│   ├── scripts/            # Deployment scripts
│   └── test/               # Contract tests
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet
- REEF tokens for testing

### 1. Clone Repository
```bash
git clone <repository-url>
cd poolfi
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cp env.example .env.local
# Update .env.local with your values
npm run dev
```

### 3. Smart Contracts (Optional)
```bash
cd smart-contracts
npm install
# Deploy contracts if needed
```

## 🌐 Live Application

### Production URL
- **Frontend**: [Your Vercel URL]
- **Contract**: `0xd9145CCE52D386f254917e481eB44e9943F39138`
- **Network**: Reef Testnet (Chain ID: 13940)

### Test the Application
1. **Connect Wallet**: Connect MetaMask to Reef Testnet
2. **Get Test Tokens**: Use Reef Testnet faucet
3. **Create Pool**: Set up your first savings pool
4. **Invite Friends**: Share pool details with others
5. **Make Contributions**: Add REEF tokens to the pool

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet Integration**: RainbowKit + Wagmi
- **Blockchain**: Viem
- **Deployment**: Vercel

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Network**: Reef Network
- **Framework**: Hardhat
- **Testing**: JavaScript/TypeScript

## 📱 Screenshots

### Desktop View
- Clean, modern interface
- Intuitive pool management
- Real-time activity tracking

### Mobile View
- Responsive design
- Touch-friendly interactions
- Full functionality on mobile

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Smart Contract Development
```bash
cd smart-contracts
npm run compile      # Compile contracts
npm run test         # Run tests
npm run deploy       # Deploy contracts
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables
4. Deploy automatically

### Smart Contracts (Remix)
1. Open [Remix IDE](https://remix.ethereum.org)
2. Copy contract code
3. Compile with Solidity 0.8.20
4. Deploy to Reef Network

## 🔒 Security

- **Smart Contract Audits**: Contracts are open source and auditable
- **Wallet Security**: No private key storage
- **Input Validation**: Client and server-side validation
- **Access Control**: Role-based permissions

## 📊 Contract Details

### SimplePoolManager Contract
- **Address**: `0xd9145CCE52D386f254917e481eB44e9943F39138`
- **Network**: Reef Testnet
- **Functions**: Create, join, contribute, manage pools
- **Events**: PoolCreated, MemberJoined, ContributionMade, PoolCompleted

### Gas Costs
- **Create Pool**: ~50,000 gas
- **Join Pool**: ~30,000 gas
- **Contribute**: ~25,000 gas
- **View Functions**: Free (read-only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful commit messages
- Add documentation for new features
- Test thoroughly before submitting

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

### Getting Help
- **Documentation**: Check the README files
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions

### Common Issues
- **Wallet Connection**: Ensure you're on Reef network
- **Transaction Failures**: Check gas fees and balance
- **Contract Errors**: Verify contract address and network

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic pool creation and management
- ✅ Wallet integration
- ✅ Real-time activity tracking

### Phase 2 (Planned)
- 🔄 Advanced pool features
- 🔄 Mobile app
- 🔄 Analytics dashboard

### Phase 3 (Future)
- 🔄 Cross-chain support
- 🔄 DeFi integrations
- 🔄 Governance features

## 📞 Contact

- **Project**: PoolFi
- **Network**: Reef Network
- **Repository**: [GitHub Link]
- **Issues**: [GitHub Issues]

---

**PoolFi** - Collaborative Savings on Reef Network 🐠

*Built with ❤️ for the Reef community*