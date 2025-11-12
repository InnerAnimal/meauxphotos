import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

export const createSupabaseClient = () => {
  // Try to use the standard auth helper first
  try {
    return createClientComponentClient()
  } catch (error) {
    // Fallback: create client manually if custom key name is used
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    // Support both standard and custom key names
    const supabaseKey = 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and key must be provided')
    }
    
    return createClient(supabaseUrl, supabaseKey)
  }
}

export const supabase = createSupabaseClient()

