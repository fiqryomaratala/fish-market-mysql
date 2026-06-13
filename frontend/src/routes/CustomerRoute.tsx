import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export function CustomerRoute() {
  const { role } = useAuth()

  if (role !== 'customer') {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
