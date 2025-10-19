import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory storage (for demo - use database in production)
let waitlistData: Array<{
  id: string
  name: string
  email: string
  country: string
  timestamp: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, country } = body

    // Basic validation
    if (!name || !email || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Check if email already exists
    const existingUser = waitlistData.find(user => user.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Add to waitlist
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      country,
      timestamp: new Date().toISOString()
    }

    waitlistData.push(newUser)

    // Log the signup (you can replace this with database storage)
    console.log('New waitlist signup:', newUser)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully added to waitlist',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          country: newUser.country
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Waitlist signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return waitlist stats (optional)
  return NextResponse.json({
    total: waitlistData.length,
    users: waitlistData.map(user => ({
      id: user.id,
      name: user.name,
      country: user.country,
      timestamp: user.timestamp
    }))
  })
}

