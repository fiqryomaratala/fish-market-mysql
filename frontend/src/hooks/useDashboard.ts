import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services'

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'customer-summary'],
    queryFn: async () => dashboardService.getSummary(),
  })
}
