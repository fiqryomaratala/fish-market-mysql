import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function CustomerRoute() {
  const { role } = useAuth()

  if (role !== 'customer') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
