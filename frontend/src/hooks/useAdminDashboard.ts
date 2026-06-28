import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services'
import { useAuth } from '@/hooks/useAuth'

export function useDashboardSummary() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['admin-dashboard', 'summary'],
    queryFn: async () => dashboardService.getSummary(),
    enabled: role === 'admin' || role === 'staff',
    retry: false,
  })
}

export function useSalesChart() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['admin-dashboard', 'sales'],
    queryFn: async () => dashboardService.getSales(),
    enabled: role === 'admin' || role === 'staff',
    retry: false,
  })
}

export function useHarvestChart() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['admin-dashboard', 'harvest'],
    queryFn: async () => dashboardService.getHarvest(),
    enabled: role === 'admin' || role === 'staff',
    retry: false,
  })
}

export function useLatestOrders() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['admin-dashboard', 'latest-orders'],
    queryFn: async () => dashboardService.getLatestOrders(),
    enabled: role === 'admin' || role === 'staff',
    retry: false,
  })
}

export function useInventoryAlert() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['admin-dashboard', 'inventory-alert'],
    queryFn: async () => dashboardService.getInventoryAlerts(),
    enabled: role === 'admin' || role === 'staff',
    retry: false,
  })
}

export function useDashboardActivityLog() {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['admin-dashboard', 'activity'],
    queryFn: async () => dashboardService.getActivityLog(),
    enabled: role === 'admin' || role === 'staff',
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: false,
  })
}
