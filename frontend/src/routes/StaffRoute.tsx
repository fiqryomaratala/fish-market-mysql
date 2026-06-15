import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function StaffRoute() {
  const { role } = useAuth()

  if (role !== 'staff') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
