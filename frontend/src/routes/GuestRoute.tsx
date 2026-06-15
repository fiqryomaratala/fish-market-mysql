import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { getDefaultPathByRole } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'

export function GuestRoute() {
  const { isAuthenticated, loading, role } = useAuth()

  if (loading) {
    return <LoadingScreen message="Preparing authentication flow..." />
  }

  if (isAuthenticated) {
    return <Navigate to={getDefaultPathByRole(role)} replace />
  }

  return <Outlet />
}
