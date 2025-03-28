import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase URL and Anon Key must be provided in environment variables');
    throw new Error(
      'Supabase URL and Anon Key must be provided in environment variables'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}

// Single instance version
export const supabase = createClient();