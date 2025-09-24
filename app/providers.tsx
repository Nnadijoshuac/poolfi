'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base, sepolia } from 'wagmi/chains'
import { http } from 'viem'
import { useState } from 'react'

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css'

// Define Reef Chain
const reefMainnet = {
  id: 13939,
  name: 'Reef Mainnet',
  network: 'reef',
  nativeCurrency: {
    decimals: 18,
    name: 'Reef',
    symbol: 'REEF',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.reefscan.com'],
    },
    public: {
      http: ['https://rpc.reefscan.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Reefscan', url: 'https://reefscan.com' },
  },
  testnet: false,
}

const reefTestnet = {
  id: 13940,
  name: 'Reef Testnet',
  network: 'reef-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Reef',
    symbol: 'REEF',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.reefscan.com'],
    },
    public: {
      http: ['https://rpc-testnet.reefscan.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Reefscan Testnet', url: 'https://testnet.reefscan.com' },
  },
  testnet: true,
}

const config = getDefaultConfig({
  appName: 'PoolFi - Reef Savings Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    reefMainnet,
    reefTestnet,
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia
  ],
  transports: {
    [reefMainnet.id]: http(),
    [reefTestnet.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}