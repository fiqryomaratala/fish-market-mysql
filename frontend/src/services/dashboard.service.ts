import api from '@/api/axios'
import type {
  ApiResponse,
  DashboardFarmMetrics,
  DashboardSalesMetrics,
  DashboardSummary,
} from '@/types/api'

class DashboardService {
  async getSummary() {
    const { data } = await api.get<ApiResponse<DashboardSummary>>('/dashboard/summary')
    return data
  }

  async getSalesMetrics() {
    const { data } = await api.get<ApiResponse<DashboardSalesMetrics>>(
      '/dashboard/sales-metrics',
    )
    return data
  }

  async getFarmMetrics() {
    const { data } = await api.get<ApiResponse<DashboardFarmMetrics>>(
      '/dashboard/farm-metrics',
    )
    return data
  }
}

export const dashboardService = new DashboardService()
