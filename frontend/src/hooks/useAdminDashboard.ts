import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services'

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['admin-dashboard', 'summary'],
    queryFn: async () => dashboardService.getSummary(),
  })
}

export function useSalesChart() {
  return useQuery({
    queryKey: ['admin-dashboard', 'sales'],
    queryFn: async () => dashboardService.getSales(),
  })
}

export function useHarvestChart() {
  return useQuery({
    queryKey: ['admin-dashboard', 'harvest'],
    queryFn: async () => dashboardService.getHarvest(),
  })
}

export function useLatestOrders() {
  return useQuery({
    queryKey: ['admin-dashboard', 'latest-orders'],
    queryFn: async () => dashboardService.getLatestOrders(),
  })
}

export function useInventoryAlert() {
  return useQuery({
    queryKey: ['admin-dashboard', 'inventory-alert'],
    queryFn: async () => dashboardService.getInventoryAlerts(),
  })
}

export function useActivityLog() {
  return useQuery({
    queryKey: ['admin-dashboard', 'activity'],
    queryFn: async () => dashboardService.getActivityLog(),
  })
}
