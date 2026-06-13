import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { useAuth } from '@/contexts/AuthContext'

function getRedirectPath(role: string | null) {
  if (role === 'admin') {
    return '/admin'
  }

  if (role === 'customer') {
    return '/customer'
  }

  return '/'
}

export function GuestRoute() {
  const { isAuthenticated, isLoading, role } = useAuth()

  if (isLoading) {
    return <LoadingScreen message="Preparing authentication flow..." />
  }

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(role)} replace />
  }

  return <Outlet />
}
