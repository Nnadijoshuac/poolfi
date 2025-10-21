import { NextApiRequest, NextApiResponse } from 'next'

// Mock data for demonstration when Supabase is not configured
const mockWaitlistData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    country: 'US',
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    country: 'UK',
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    createdAt: new Date('2024-01-16T14:20:00Z'),
    updatedAt: new Date('2024-01-16T14:20:00Z')
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    country: 'CA',
    ipAddress: '192.168.1.3',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    createdAt: new Date('2024-01-17T09:15:00Z'),
    updatedAt: new Date('2024-01-17T09:15:00Z')
  }
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Check for password in headers
    const password = req.headers['x-admin-password'] as string
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Po0lf!_admIn'
    
    if (!password || password !== expectedPassword) {
      return res.status(401).json({ error: 'Unauthorized access' })
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(200).json({
        success: true,
        data: mockWaitlistData,
        count: mockWaitlistData.length,
        message: 'Supabase not configured. Showing mock data. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      })
    }

    // For now, just return mock data since Supabase is not configured
    return res.status(200).json({
      success: true,
      data: mockWaitlistData,
      count: mockWaitlistData.length,
      message: 'Supabase not configured. Showing mock data. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    })
  } catch (error) {
    console.error('Admin waitlist fetch error:', error)
    return res.status(500).json({ error: 'Failed to fetch waitlist data' })
  }
}
