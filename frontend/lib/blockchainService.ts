import { formatEther } from 'viem'

// Types for blockchain events
export interface BlockchainEvent {
  address: string
  blockNumber: bigint
  transactionHash: string
  logIndex: number
  args: any
  eventName: string
}

export interface EventFilter {
  fromBlock?: bigint
  toBlock?: bigint
  address?: string
  topics?: string[]
}

// Event ABI definitions for filtering
export const POOL_EVENTS_ABI = [
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
      {"indexed": true, "internalType": "address", "name": "member", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "FundsWithdrawn",
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
      {"indexed": false, "internalType": "uint256", "name": "totalAmount", "type": "uint256"}
    ],
    "name": "PoolCompleted",
    "type": "event"
  }
] as const

// Service class for blockchain interactions
export class BlockchainService {
  private rpcUrl: string
  private contractAddress: string

  constructor(rpcUrl: string, contractAddress: string) {
    this.rpcUrl = rpcUrl
    this.contractAddress = contractAddress
  }

  // Fetch events from blockchain
  async getEvents(
    eventName: string,
    filter: EventFilter = {},
    userAddress?: string
  ): Promise<BlockchainEvent[]> {
    try {
      // In a real implementation, you would use:
      // 1. viem's getLogs function
      // 2. A service like The Graph
      // 3. Alchemy/Infura event APIs
      
      // For now, we'll simulate this with mock data
      return this.getMockEvents(eventName, userAddress)
    } catch (error) {
      console.error('Error fetching events:', error)
      throw new Error('Failed to fetch blockchain events')
    }
  }

  // Mock implementation - replace with real blockchain calls
  private getMockEvents(eventName: string, userAddress?: string): BlockchainEvent[] {
    // Return empty array - no mock data
    return []
  }

  // Get all user-related events
  async getUserEvents(userAddress: string, limit: number = 10): Promise<BlockchainEvent[]> {
    const eventNames = ['ContributionMade', 'FundsWithdrawn', 'MemberJoined', 'PoolCreated', 'PoolCompleted']
    const allEvents: BlockchainEvent[] = []

    for (const eventName of eventNames) {
      try {
        const events = await this.getEvents(eventName, {}, userAddress)
        allEvents.push(...events)
      } catch (error) {
        console.error(`Error fetching ${eventName} events:`, error)
      }
    }

    // Sort by block number (most recent first)
    return allEvents
      .sort((a, b) => Number(b.blockNumber - a.blockNumber))
      .slice(0, limit)
  }

  // Get pool information for events
  async getPoolInfo(poolId: bigint): Promise<{
    name: string
    description: string
  } | null> {
    try {
      // In a real implementation, you would call the contract's getPoolInfo function
      // For now, return null - no mock data
      return null
    } catch (error) {
      console.error('Error fetching pool info:', error)
      return null
    }
  }
}

// Utility function to create blockchain service instance
export function createBlockchainService(): BlockchainService | null {
  const rpcUrl = process.env.NEXT_PUBLIC_REEF_RPC_URL || 'https://rpc.reefscan.com'
  const contractAddress = process.env.NEXT_PUBLIC_POOL_MANAGER_ADDRESS || '0xd9145CCE52D386f254917e481eB44e9943F39138'

  if (!rpcUrl || !contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    return null
  }

  return new BlockchainService(rpcUrl, contractAddress)
}

// Helper function to format event data
export function formatEventData(event: BlockchainEvent): {
  type: 'contribution' | 'withdrawal' | 'join' | 'create' | 'complete'
  title: string
  description: string
  amount?: string
  poolId?: number
  poolName?: string
  timestamp: number
  transactionHash: string
} {
  const poolId = event.args.poolId ? Number(event.args.poolId) : undefined
  const timestamp = Date.now() - (Number(event.blockNumber) * 1000) // Approximate timestamp

  switch (event.eventName) {
    case 'ContributionMade':
      return {
        type: 'contribution',
        title: 'Contribution Made',
        description: `You contributed to pool #${poolId}`,
        amount: `${formatEther(event.args.amount)} REEF`,
        poolId,
        timestamp,
        transactionHash: event.transactionHash
      }

    case 'FundsWithdrawn':
      return {
        type: 'withdrawal',
        title: 'Funds Withdrawn',
        description: `You withdrew from pool #${poolId}`,
        amount: `${formatEther(event.args.amount)} REEF`,
        poolId,
        timestamp,
        transactionHash: event.transactionHash
      }

    case 'MemberJoined':
      return {
        type: 'join',
        title: 'Pool Joined',
        description: `You joined pool #${poolId}`,
        poolId,
        timestamp,
        transactionHash: event.transactionHash
      }

    case 'PoolCreated':
      return {
        type: 'create',
        title: 'Pool Created',
        description: `You created "${event.args.name}"`,
        poolId,
        poolName: event.args.name,
        timestamp,
        transactionHash: event.transactionHash
      }

    case 'PoolCompleted':
      return {
        type: 'complete',
        title: 'Pool Completed',
        description: `Pool #${poolId} has reached its target`,
        poolId,
        timestamp,
        transactionHash: event.transactionHash
      }

    default:
      return {
        type: 'contribution',
        title: 'Unknown Activity',
        description: 'An activity occurred',
        timestamp,
        transactionHash: event.transactionHash
      }
  }
}
