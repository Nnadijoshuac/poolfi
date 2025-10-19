import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from './database'

// Initialize Supabase client
export const supabase = createClient(
  supabaseConfig.url,
  supabaseConfig.anonKey
)

// Waitlist table operations
export const waitlistService = {
  async addUser(userData: {
    name: string
    email: string
    country: string
    ip_address?: string
    user_agent?: string
  }) {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([{
        name: userData.name,
        email: userData.email,
        country: userData.country,
        ip_address: userData.ip_address,
        user_agent: userData.user_agent,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw new Error(error.message)
    }

    return data
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data
  },

  async getUserCount() {
    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    if (error) {
      throw new Error(error.message)
    }

    return count || 0
  }
}

