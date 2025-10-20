import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, country } = body

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Check if email already exists
    const existingUser = await prisma.waitlist.findUnique({
      where: { email: email.toLowerCase().trim() }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409 }
      )
    }
    
    // Create new waitlist entry
    const newUser = await prisma.waitlist.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        country: country || null,
        ipAddress,
        userAgent,
      }
    })
    
    console.log('New waitlist signup:', {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      country: newUser.country
    })
    
    return NextResponse.json({ 
      success: true,
      message: 'Successfully added to waitlist',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        country: newUser.country,
        createdAt: newUser.createdAt
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Waitlist creation error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Get waitlist stats
    const totalCount = await prisma.waitlist.count()
    const recentUsers = await prisma.waitlist.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })
    
    return NextResponse.json({
      total: totalCount,
      users: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        country: user.country,
        timestamp: user.createdAt
      }))
    })
    
  } catch (error) {
    console.error('Waitlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch waitlist data' },
      { status: 500 }
    )
  }
}

