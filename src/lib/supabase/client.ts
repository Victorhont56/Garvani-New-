// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types' // Your generated types

export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'Supabase URL and Anon Key must be provided in environment variables'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseKey)
}

// Singleton instance
export const supabase = createClient()

/**
 * Type-safe admin check using your RLS policies
 * @param userId Authenticated user ID
 * @returns Promise<boolean>
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('is_admin')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    return data?.is_admin ?? false
  } catch (error) {
    console.error('Admin check failed:', error)
    return false
  }
}

/**
 * Type-safe real-time subscription helper
 * @param table Table name
 * @param callback Function to handle changes
 * @param filter Optional filter (e.g., 'status=eq.pending')
 */
export const subscribeToChanges = <T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: {
    event: 'INSERT' | 'UPDATE' | 'DELETE'
    new: Database['public']['Tables'][T]['Row']
    old: Database['public']['Tables'][T]['Row']
  }) => void,
  filter?: string
) => {
  const channel = supabase
    .channel('table-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table.toString(),
        ...(filter ? { filter } : {}),
      },
      callback
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// Example usage in components:
// const unsubscribe = subscribeToChanges('listings', (payload) => {
//   console.log('Change detected:', payload)
// }, 'status=eq.pending')