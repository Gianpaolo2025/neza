
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a null client if environment variables are missing
// This allows the app to run without Supabase until properly configured
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is available
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey)

// Helper function that throws a more helpful error when Supabase is used but not configured
export const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please connect your project to Supabase using the integration button.')
  }
  return supabase
}
