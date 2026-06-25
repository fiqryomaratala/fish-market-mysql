import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { staffDashboardService } from '@/services/staff-dashboard.service'

export function useStaffDashboard() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['staff-dashboard'],
    queryFn: async () => staffDashboardService.getStaffDashboard(),
    enabled: role === 'staff' || role === 'admin',
    retry: false,
  })
}
