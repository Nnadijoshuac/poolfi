import { NextRequest, NextResponse } from 'next/server'
import { waitlistService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Check for password in headers
    const password = request.headers.get('x-admin-password')
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123' // Default password
    
    if (!password || password !== expectedPassword) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    // Fetch all waitlist users
    const users = await waitlistService.getAllUsers()
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    })
    
  } catch (error) {
    console.error('Admin waitlist fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch waitlist data' },
      { status: 500 }
    )
  }
}
