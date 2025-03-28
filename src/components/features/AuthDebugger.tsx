// src/components/AuthDebugger.tsx
'use client'

import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'

export const AuthDebugger = ({ supabase }: { supabase: any }) => {
  const runDebug = async () => {
    try {
      console.group('%cSupabase Auth Debug', 'color: #3b82f6; font-weight: bold')
      
      // 1. Check environment variables
      console.log('Environment:', {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 5) + '...'
      })

      // 2. Check auth settings
      const { data: settings, error: settingsError } = await supabase.auth.getSettings()
      console.log('Auth Settings:', settings)
      if (settingsError) console.error('Settings Error:', settingsError)

      // 3. Check current session
      const { data: session, error: sessionError } = await supabase.auth.getSession()
      console.log('Session:', session)
      if (sessionError) console.error('Session Error:', sessionError)

      // 4. Check current user
      const { data: user, error: userError } = await supabase.auth.getUser()
      console.log('User:', user)
      if (userError) console.error('User Error:', userError)

      // 5. Check client configuration
      console.log('Client Config:', {
        auth: {
          url: supabase.auth.api.url,
          headers: supabase.auth.api.headers,
          storageKey: supabase.auth.api.storageKey
        },
        supabaseUrl: supabase.supabaseUrl,
        supabaseKey: supabase.supabaseKey?.substring(0, 5) + '...'
      })

      console.groupEnd()
      toast.success('Auth debug completed - check console')
    } catch (error) {
      console.error('Debug Error:', error)
      toast.error('Debug failed - check console')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="outline" 
        size="sm"
        onClick={runDebug}
        className="text-xs"
      >
        Debug Auth
      </Button>
    </div>
  )
}