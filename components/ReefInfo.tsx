'use client'

import { useChainId } from 'wagmi'

export default function ReefInfo() {
  const chainId = useChainId()
  
  const isReefChain = chainId === 13939 || chainId === 13940
  const isReefMainnet = chainId === 13939
  const isReefTestnet = chainId === 13940

  if (!isReefChain) {
    return null
  }

  return (
    <div className="mx-5 my-3 p-3 rounded-lg border-2" style={{ 
      backgroundColor: '#f0fdfa', 
      borderColor: '#00D4AA' 
    }}>
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: '#00D4AA' }}
        ></div>
        <span className="font-semibold text-sm" style={{ color: '#065f46' }}>
          🐠 Connected to Reef Chain
        </span>
      </div>
      
      <div className="text-xs" style={{ color: '#047857' }}>
        {isReefMainnet ? (
          <div>
            <p className="mb-1">✅ Mainnet - Real REEF tokens</p>
            <p>• Fast transactions • Low fees • EVM compatible</p>
          </div>
        ) : (
          <div>
            <p className="mb-1">🧪 Testnet - Free REEF tokens</p>
            <p>• Get test tokens from <a href="https://faucet.reefscan.com" target="_blank" rel="noopener noreferrer" className="underline">Reef Faucet</a></p>
          </div>
        )}
      </div>
    </div>
  )
}
