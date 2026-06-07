import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * Creates a browser-safe Supabase client.
 * This client should only use the NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Never expose the Service Role key in this file.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
