import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function CustomerRoute() {
  const { user } = useAuth()

  if (user?.role !== 'customer') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
