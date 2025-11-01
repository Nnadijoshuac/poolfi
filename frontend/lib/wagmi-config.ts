'use client'

import { defineChain } from 'viem'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Define Reef Pelagia chain
const reefPelagiaChain = defineChain({
  id: 13939,
  name: 'Reef Pelagia',
  network: 'reef-pelagia',
  nativeCurrency: {
    decimals: 18,
    name: 'REEF',
    symbol: 'REEF',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_REEF_RPC_URL || 'http://34.123.142.246:8545'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_REEF_RPC_URL || 'http://34.123.142.246:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Reef Explorer', url: 'https://dev.papi.how/explorer' },
  },
})

// Get WalletConnect Project ID from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Validate that projectId is provided
if (!projectId) {
  throw new Error(
    'Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID. ' +
    'Please set this environment variable with your WalletConnect Cloud projectId. ' +
    'Get one for free at https://cloud.walletconnect.com/'
  )
}

// Configure wagmi config with RainbowKit
// Note: getDefaultConfig from RainbowKit v2 handles both wagmi and RainbowKit setup
export const wagmiConfig = getDefaultConfig({
  appName: 'PoolFi',
  projectId: projectId,
  chains: [reefPelagiaChain],
  ssr: true,
})

