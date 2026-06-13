import { useQueries } from '@tanstack/react-query'
import { dashboardService } from '@/services'

export function useDashboard() {
  const [summaryQuery, salesMetricsQuery, farmMetricsQuery] = useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'summary'],
        queryFn: async () => dashboardService.getSummary(),
      },
      {
        queryKey: ['dashboard', 'sales-metrics'],
        queryFn: async () => dashboardService.getSalesMetrics(),
      },
      {
        queryKey: ['dashboard', 'farm-metrics'],
        queryFn: async () => dashboardService.getFarmMetrics(),
      },
    ],
  })

  return {
    summaryQuery,
    salesMetricsQuery,
    farmMetricsQuery,
    isLoading:
      summaryQuery.isLoading ||
      salesMetricsQuery.isLoading ||
      farmMetricsQuery.isLoading,
    isError:
      summaryQuery.isError ||
      salesMetricsQuery.isError ||
      farmMetricsQuery.isError,
  }
}
