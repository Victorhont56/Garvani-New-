// src/components/auth/ProtectedRoute.tsx
'use client'

import { Navigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div> // Or your custom loader
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}