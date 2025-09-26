import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'

// Contract ABI - BasicPool ABI (matches your deployed contract)
const BASIC_POOL_ABI = [
  {
    "inputs": [],
    "name": "poolCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_name", "type": "string"},
      {"internalType": "string", "name": "_description", "type": "string"},
      {"internalType": "uint256", "name": "_targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_contributionAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "_maxMembers", "type": "uint256"},
      {"internalType": "uint256", "name": "_deadline", "type": "uint256"}
    ],
    "name": "createPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "joinPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolInfo",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "currentAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "contributionAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "maxMembers", "type": "uint256"},
      {"internalType": "uint256", "name": "currentMembers", "type": "uint256"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"},
      {"internalType": "bool", "name": "completed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "targetAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "contributionAmount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "maxMembers", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "deadline", "type": "uint256"}
    ],
    "name": "PoolCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"}
    ],
    "name": "MemberJoined",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "ContributionMade",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256"}
    ],
    "name": "PoolCompleted",
    "type": "event"
  }
] as const

// Contract addresses - Deployed contract address
const BASIC_POOL_ADDRESS = process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS as `0x${string}` || '0xd9145CCE52D386f254917e481eB44e9943F39138'

// Check if contract is deployed
const isContractDeployed = BASIC_POOL_ADDRESS && BASIC_POOL_ADDRESS !== '0x0000000000000000000000000000000000000000'

export function usePoolManager() {
  const { address, isConnected } = useAccount()
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Get pool count
  const { data: poolCount } = useReadContract({
    address: isContractDeployed ? BASIC_POOL_ADDRESS : undefined,
    abi: BASIC_POOL_ABI,
    functionName: 'poolCount'
  })

  // Load all pools
  useEffect(() => {
    if (!poolCount || !isConnected || !isContractDeployed) {
      setPools([])
      setLoading(false)
      return
    }

    const loadPools = async () => {
      setLoading(true)
      const poolData: any[] = []
      
      try {
        for (let i = 1; i <= Number(poolCount); i++) {
          // Get pool data from contract
          const poolInfo = await fetchPoolInfo(i)
          if (poolInfo) {
            poolData.push({
              id: i,
              targetAmount: poolInfo.targetAmount,
              deadline: poolInfo.deadline,
              maxMembers: poolInfo.maxMembers,
              currentMembers: poolInfo.currentMembers,
              isActive: poolInfo.isActive,
              isCompleted: poolInfo.isCompleted,
              name: `Pool ${i}`, // SecurePool doesn't have names, so we'll generate them
              description: `Target: ${formatEther(poolInfo.targetAmount)} REEF`
            })
          }
        }
        setPools(poolData)
      } catch (error) {
        console.error('Error loading pools:', error)
        setPools([])
      } finally {
        setLoading(false)
      }
    }

    loadPools()
  }, [poolCount, isConnected, isContractDeployed])

  return {
    pools,
    loading,
    poolCount: poolCount ? Number(poolCount) : 0,
    isContractDeployed
  }
}

// Helper function to fetch pool info
async function fetchPoolInfo(poolId: number): Promise<{
  targetAmount: bigint
  deadline: bigint
  maxMembers: bigint
  currentMembers: bigint
  isActive: boolean
  isCompleted: boolean
} | null> {
  // This would need to be implemented with a contract call
  // For now, return null to avoid errors
  return null
}

export function useCreatePool() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const createPool = (poolData: {
    name: string
    description: string
    targetAmount: string
    contributionAmount: string
    maxMembers: number
    deadline: number
  }) => {
    if (!isContractDeployed) return

    writeContract({
      address: BASIC_POOL_ADDRESS as `0x${string}`,
      abi: BASIC_POOL_ABI,
      functionName: 'createPool',
      args: [
        poolData.name,
        poolData.description,
        parseEther(poolData.targetAmount),
        parseEther(poolData.contributionAmount),
        BigInt(poolData.maxMembers),
        BigInt(poolData.deadline)
      ]
    })
  }

  return {
    createPool,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

export function useJoinAndContribute() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const joinAndContribute = (poolId: number, value: string) => {
    if (!isContractDeployed) return

    writeContract({
      address: SECURE_POOL_ADDRESS as `0x${string}`,
      abi: SECURE_POOL_ABI,
      functionName: 'joinAndContribute',
      args: [BigInt(poolId)],
      value: parseEther(value)
    })
  }

  return {
    joinAndContribute,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

export function useCancelPool() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const cancelPool = (poolId: number) => {
    if (!isContractDeployed) return

    writeContract({
      address: SECURE_POOL_ADDRESS as `0x${string}`,
      abi: SECURE_POOL_ABI,
      functionName: 'cancelPool',
      args: [BigInt(poolId)]
    })
  }

  return {
    cancelPool,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

export function useWithdraw() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const withdraw = (poolId: number) => {
    if (!isContractDeployed) return

    writeContract({
      address: SECURE_POOL_ADDRESS as `0x${string}`,
      abi: SECURE_POOL_ABI,
      functionName: 'withdraw',
      args: [BigInt(poolId)]
    })
  }

  return {
    withdraw,
    isLoading: isPending || isConfirming,
    isSuccess,
    error
  }
}

// Hook to get user's REEF token balance from wallet
export function useREEFBalance() {
  const { address } = useAccount()
  
  // Get native REEF balance from wallet
  const { data: balance } = useReadContract({
    address: address,
    abi: [
      {
        "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'balanceOf',
    args: address ? [address] : undefined
  })

  return {
    balance: balance ? formatEther(balance as bigint) : '0',
    isLoading: false
  }
}