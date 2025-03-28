// src/types/supabase.d.ts
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/database.types'

declare module '@/app/AuthProvider' {
  interface AuthContextType {
    user: User | null
    isLoading: boolean
    session: Session | null
    supabase: SupabaseClient<Database>
  }
}