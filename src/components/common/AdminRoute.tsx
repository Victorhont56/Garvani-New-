import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/app/AuthProvider'

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading admin verification...</div>
  }

  if (!user) {
    return <Navigate to="/login-page" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return <>{children}</>
}