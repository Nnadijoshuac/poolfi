// Database configuration for different providers
// Choose one based on your preference

// Option A: Supabase (Recommended)
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

// Option B: PlanetScale (MySQL)
export const planetscaleConfig = {
  host: process.env.DATABASE_HOST!,
  username: process.env.DATABASE_USERNAME!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
}

// Option C: MongoDB
export const mongoConfig = {
  uri: process.env.MONGODB_URI!,
  database: process.env.MONGODB_DATABASE || 'poolfi',
}

// Waitlist user interface
export interface WaitlistUser {
  id: string
  name: string
  email: string
  country: string
  timestamp: string
  ip_address?: string
  user_agent?: string
}

// Database operations interface
export interface DatabaseOperations {
  addUser(user: Omit<WaitlistUser, 'id' | 'timestamp'>): Promise<WaitlistUser>
  getUserByEmail(email: string): Promise<WaitlistUser | null>
  getAllUsers(): Promise<WaitlistUser[]>
  getUserCount(): Promise<number>
}

