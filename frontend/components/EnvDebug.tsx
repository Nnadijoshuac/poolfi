'use client'

import { useAccount } from 'wagmi'

export default function EnvDebug() {
  const { address, isConnected } = useAccount()

  if (process.env.NODE_ENV !== 'development') {
    return null // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      <div className="space-y-1">
        <div>Contract: {process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS ? '✅' : '❌'}</div>
        <div>WalletConnect: {process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ? '✅' : '❌'}</div>
        <div>RPC URL: {process.env.NEXT_PUBLIC_REEF_RPC_URL ? '✅' : '❌'}</div>
        <div>Chain ID: {process.env.NEXT_PUBLIC_REEF_CHAIN_ID ? '✅' : '❌'}</div>
        <div>Wallet: {isConnected ? '✅' : '❌'}</div>
        <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</div>
      </div>
    </div>
  )
}
