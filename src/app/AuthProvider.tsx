import { createClient } from '@/lib/supabase/client'
import { SessionContextProvider, useSessionContext } from '@supabase/auth-helpers-react'
import { useState, useEffect, createContext, useContext } from 'react'
import { checkAdminStatus } from '@/lib/supabase/admin'

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  supabase: any;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isLoading: true,
  supabase: null
})

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => createClient())
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    isAdmin: false,
    isLoading: true,
    supabase: supabaseClient
  })

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <AuthContent setAuthState={setAuthState} />
      <AuthContext.Provider value={authState}>
        {!authState.isLoading && children}
      </AuthContext.Provider>
    </SessionContextProvider>
  )
}

interface AuthContentProps {
  setAuthState: (state: AuthContextType) => void;
}

function AuthContent({ setAuthState }: AuthContentProps) {
  const { session, isLoading, supabaseClient } = useSessionContext()

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) return

      if (session?.user) {
        const isAdmin = await checkAdminStatus(session.user.id)
        setAuthState({
          user: session.user,
          isAdmin,
          isLoading: false,
          supabase: supabaseClient
        })
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          isLoading: false,
          supabase: supabaseClient
        })
      }
    }

    checkAuth()
  }, [session, isLoading, supabaseClient, setAuthState])

  return null
}

export function useAuth() {
  return useContext(AuthContext)
}