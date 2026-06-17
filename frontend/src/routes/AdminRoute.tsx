import { Navigate, Outlet } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { useAuth } from '@/hooks/useAuth'

export function AdminRoute() {
  const { role, loading } = useAuth()

  if (loading) {
    return <LoadingScreen message="Preparing admin workspace..." />
  }

  if (role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
