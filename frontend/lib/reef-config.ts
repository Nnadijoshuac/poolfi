// Reef.io Token Configuration
export const REEF_TOKENS = {
  // Native REEF token
  REEF: {
    address: '0x0000000000000000000000000000000000000000', // Native token
    symbol: 'REEF',
    name: 'Reef',
    decimals: 18,
    logoURI: '/reef_logo.png',
    chainId: 13939, // Reef Mainnet
  },
  // REEF20 tokens (examples - these would be actual deployed tokens)
  USDC: {
    address: '0x0000000000000000000000000000000000000000', // Placeholder - needs actual USDC contract on Reef
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: '/usdc-logo.png',
    chainId: 13939,
  },
  USDT: {
    address: '0x0000000000000000000000000000000000000000', // Placeholder - needs actual USDT contract on Reef
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: '/usdt-logo.png',
    chainId: 13939,
  },
} as const

// Reef Testnet tokens
export const REEF_TESTNET_TOKENS = {
  REEF: {
    address: '0x0000000000000000000000000000000000000000', // Native token
    symbol: 'REEF',
    name: 'Reef',
    decimals: 18,
    logoURI: '/reef_logo.png',
    chainId: 13940, // Reef Testnet
  },
} as const

// Reef Chain Configuration
export const REEF_CHAINS = {
  mainnet: {
    id: 13939,
    name: 'Reef Mainnet',
    rpcUrl: 'https://rpc.reefscan.com',
    blockExplorer: 'https://reefscan.com',
    faucet: null, // No faucet for mainnet
    nativeCurrency: {
      name: 'Reef',
      symbol: 'REEF',
      decimals: 18,
    },
  },
  testnet: {
    id: 13940,
    name: 'Reef Testnet',
    rpcUrl: 'https://rpc-testnet.reefscan.com',
    blockExplorer: 'https://testnet.reefscan.com',
    faucet: 'https://faucet.reefscan.com',
    nativeCurrency: {
      name: 'Reef',
      symbol: 'REEF',
      decimals: 18,
    },
  },
} as const

// Helper functions
export const isReefChain = (chainId: number): boolean => {
  return chainId === REEF_CHAINS.mainnet.id || chainId === REEF_CHAINS.testnet.id
}

export const isReefMainnet = (chainId: number): boolean => {
  return chainId === REEF_CHAINS.mainnet.id
}

export const isReefTestnet = (chainId: number): boolean => {
  return chainId === REEF_CHAINS.testnet.id
}

export const getReefTokens = (chainId: number) => {
  if (isReefMainnet(chainId)) {
    return REEF_TOKENS
  } else if (isReefTestnet(chainId)) {
    return REEF_TESTNET_TOKENS
  }
  return {}
}

export const getReefChainInfo = (chainId: number) => {
  if (isReefMainnet(chainId)) {
    return REEF_CHAINS.mainnet
  } else if (isReefTestnet(chainId)) {
    return REEF_CHAINS.testnet
  }
  return null
}
