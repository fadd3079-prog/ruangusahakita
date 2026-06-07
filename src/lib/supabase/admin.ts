import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Creates an admin Supabase client utilizing the SERVICE ROLE KEY.
 * WARNING: This client bypasses Row Level Security (RLS).
 * MUST NEVER BE EXPOSED TO THE CLIENT/BROWSER.
 * Strictly use this in server-side only environments (Server Actions, Route Handlers, Background Jobs)
 * where elevated privileges are required.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing.')
  }

  return createSupabaseClient<Database>(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      }
    }
  )
}
