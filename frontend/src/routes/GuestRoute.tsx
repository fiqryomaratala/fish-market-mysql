import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { useAuth } from '@/hooks/useAuth'

function getRedirectPath(role?: string) {
  if (role === 'admin') {
    return '/admin'
  }

  if (role === 'customer') {
    return '/customer'
  }

  return '/'
}

export function GuestRoute() {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <LoadingScreen message="Preparing authentication flow..." />
  }

  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(user?.role)} replace />
  }

  return <Outlet />
}
