// Database configuration
// Using Prisma with PostgreSQL

export const databaseConfig = {
  provider: 'postgresql' as const,
  url: process.env.DATABASE_URL || 'postgresql://localhost:5432/poolfi',
}

// Waitlist user interface (matches Prisma schema)
export interface WaitlistUser {
  id: string
  name: string
  email: string
  country?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
  updatedAt: Date
}

// Input type for creating waitlist users
export interface CreateWaitlistUser {
  name: string
  email: string
  country?: string
}

// Database operations interface
export interface DatabaseOperations {
  addUser(user: CreateWaitlistUser): Promise<WaitlistUser>
  getUserByEmail(email: string): Promise<WaitlistUser | null>
  getAllUsers(): Promise<WaitlistUser[]>
  getUserCount(): Promise<number>
}

