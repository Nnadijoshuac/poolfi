import { prisma } from './prisma'
import type { CreateWaitlistUser, WaitlistUser } from './database'

// Waitlist service using Prisma
export const waitlistService = {
  async addUser(userData: CreateWaitlistUser & {
    ipAddress?: string
    userAgent?: string
  }): Promise<WaitlistUser> {
    const user = await prisma.waitlist.create({
      data: {
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        country: userData.country || null,
        ipAddress: userData.ipAddress || null,
        userAgent: userData.userAgent || null,
      }
    })

    return user
  },

  async getUserByEmail(email: string): Promise<WaitlistUser | null> {
    const user = await prisma.waitlist.findUnique({
      where: { 
        email: email.toLowerCase().trim() 
      }
    })

    return user
  },

  async getAllUsers(): Promise<WaitlistUser[]> {
    const users = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return users
  },

  async getUserCount(): Promise<number> {
    const count = await prisma.waitlist.count()
    return count
  },

  async getRecentUsers(limit: number = 10): Promise<WaitlistUser[]> {
    const users = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return users
  }
}

