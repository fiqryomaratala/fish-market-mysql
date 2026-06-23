import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/services'
import type { ReportDateFilter } from '@/types/report'

type ReportHookOptions = {
  enabled?: boolean
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => ({}),
    enabled: false,
  })
}

export function useSalesReport(filter: ReportDateFilter, options: ReportHookOptions = {}) {
  return useQuery({
    queryKey: ['reports', 'sales', filter],
    queryFn: async () => reportService.getSalesReport(filter),
    enabled: options.enabled,
  })
}

export function useHarvestReport(filter: ReportDateFilter, options: ReportHookOptions = {}) {
  return useQuery({
    queryKey: ['reports', 'harvest', filter],
    queryFn: async () => reportService.getHarvestReport(filter),
    enabled: options.enabled,
  })
}

export function useInventoryReport(filter: ReportDateFilter, options: ReportHookOptions = {}) {
  return useQuery({
    queryKey: ['reports', 'inventory', filter],
    queryFn: async () => reportService.getInventoryReport(filter),
    enabled: options.enabled,
  })
}

export function useFeedingReport(filter: ReportDateFilter, options: ReportHookOptions = {}) {
  return useQuery({
    queryKey: ['reports', 'feeding', filter],
    queryFn: async () => reportService.getFeedingReport(filter),
    enabled: options.enabled,
  })
}

export function useFishBatchReport(filter: ReportDateFilter, options: ReportHookOptions = {}) {
  return useQuery({
    queryKey: ['reports', 'fish-batches', filter],
    queryFn: async () => reportService.getFishBatchReport(filter),
    enabled: options.enabled,
  })
}

export function useCustomerReport(filter: ReportDateFilter, options: ReportHookOptions = {}) {
  return useQuery({
    queryKey: ['reports', 'customers', filter],
    queryFn: async () => reportService.getCustomerReport(filter),
    enabled: options.enabled,
  })
}
