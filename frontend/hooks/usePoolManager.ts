import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther, readContract, createPublicClient, http } from 'viem'
import { reefTestnet } from 'wagmi/chains'

// Contract ABI - PoolFi ABI (matches your deployed contract)
const POOLFI_ABI = [
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
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "cancelPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolBasicInfo",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "string", "name": "name", "type": "string"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolFinancialInfo",
    "outputs": [
      {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "currentAmount", "type": "uint256"},
      {"internalType": "uint256", "name": "contributionAmount", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}],
    "name": "getPoolMemberInfo",
    "outputs": [
      {"internalType": "uint256", "name": "maxMembers", "type": "uint256"},
      {"internalType": "uint256", "name": "currentMembers", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getUserPools",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_poolId", "type": "uint256"}, {"internalType": "address", "name": "_user", "type": "address"}],
    "name": "hasUserContributed",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
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
      {"indexed": true, "internalType": "address", "name": "contributor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "totalContributed", "type": "uint256"}
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
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "poolId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "recipient", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "FundsWithdrawn",
    "type": "event"
  }
] as const

// Contract addresses - Deployed PoolFi contract address
const POOLFI_ADDRESS = process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS as `0x${string}` || '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B'

// Check if contract is deployed
const isContractDeployed = POOLFI_ADDRESS && POOLFI_ADDRESS !== '0x0000000000000000000000000000000000000000'

export function usePoolManager() {
  const { address, isConnected } = useAccount()
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Get pool count
  const { data: poolCount } = useReadContract({
    address: isContractDeployed ? POOLFI_ADDRESS : undefined,
    abi: POOLFI_ABI,
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
              name: poolInfo.basic.name,
              description: `Pool created by ${poolInfo.basic.creator}`,
              targetAmount: poolInfo.financial.targetAmount,
              currentAmount: poolInfo.financial.currentAmount,
              contributionAmount: poolInfo.financial.contributionAmount,
              maxMembers: poolInfo.members.maxMembers,
              currentMembers: poolInfo.members.currentMembers,
              deadline: poolInfo.basic.deadline,
              active: poolInfo.basic.isActive,
              completed: poolInfo.basic.isCompleted,
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
  basic: {
    id: bigint
    creator: string
    name: string
    deadline: bigint
    isActive: boolean
    isCompleted: boolean
  }
  financial: {
    targetAmount: bigint
    currentAmount: bigint
    contributionAmount: bigint
  }
  members: {
    maxMembers: bigint
    currentMembers: bigint
  }
} | null> {
  try {
    // Create a public client for reading contract data
    const publicClient = createPublicClient({
      chain: reefTestnet,
      transport: http(process.env.NEXT_PUBLIC_REEF_RPC_URL || 'http://34.123.142.246:8545'),
    })

    const [basicInfo, financialInfo, memberInfo] = await Promise.all([
      readContract(publicClient, {
        address: POOLFI_ADDRESS,
        abi: POOLFI_ABI,
        functionName: 'getPoolBasicInfo',
        args: [BigInt(poolId)]
      }),
      readContract(publicClient, {
        address: POOLFI_ADDRESS,
        abi: POOLFI_ABI,
        functionName: 'getPoolFinancialInfo',
        args: [BigInt(poolId)]
      }),
      readContract(publicClient, {
        address: POOLFI_ADDRESS,
        abi: POOLFI_ABI,
        functionName: 'getPoolMemberInfo',
        args: [BigInt(poolId)]
      })
    ])

    return {
      basic: basicInfo,
      financial: financialInfo,
      members: memberInfo
    }
  } catch (error) {
    console.error(`Error fetching pool ${poolId} info:`, error)
    return null
  }
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
    if (!isContractDeployed) {
      console.error('Contract not deployed')
      return
    }

    console.log('Creating pool with data:', poolData)
    console.log('Contract address:', POOLFI_ADDRESS)

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: POOLFI_ABI,
      functionName: 'createPool',
      args: [
        poolData.name,
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

export function useContribute() {
  const { writeContract, data, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const contribute = (poolId: number, value: string) => {
    if (!isContractDeployed) return

    writeContract({
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: POOLFI_ABI,
      functionName: 'contribute',
      args: [BigInt(poolId)],
      value: parseEther(value)
    })
  }

  return {
    contribute,
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
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: POOLFI_ABI,
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
      address: POOLFI_ADDRESS as `0x${string}`,
      abi: POOLFI_ABI,
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