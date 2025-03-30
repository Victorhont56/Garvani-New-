import { createClient } from '@/lib/supabase/client'
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react'
import { useState, useEffect } from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}



export function useAuth() {
  const { session, isLoading, supabaseClient: supabase } = useSessionContext();

  return {
    user: session?.user || null,
    supabase, 
    isLoading,
    session
  }
}