// Hooks untuk Analytics Dashboard
import { useQuery, useQueries } from '@tanstack/react-query'
import { analyticsService } from '@/services/analytics.service'
import type { DateFilterRange } from '@/types/analytics'

export function useRevenueAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['revenue-analytics', params],
    queryFn: () => analyticsService.getRevenueAnalytics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useOrderAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['order-analytics', params],
    queryFn: () => analyticsService.getOrderAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCustomerAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['customer-analytics', params],
    queryFn: () => analyticsService.getCustomerAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useHarvestAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['harvest-analytics', params],
    queryFn: () => analyticsService.getHarvestAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useFeedingAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['feeding-analytics', params],
    queryFn: () => analyticsService.getFeedingAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useInventoryAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['inventory-analytics', params],
    queryFn: () => analyticsService.getInventoryAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePondAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['pond-analytics', params],
    queryFn: () => analyticsService.getPondAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useFishBatchAnalytics(params?: DateFilterRange) {
  return useQuery({
    queryKey: ['fish-batch-analytics', params],
    queryFn: () => analyticsService.getFishBatchAnalytics(params),
    staleTime: 5 * 60 * 1000,
  })
}

export function useAllAnalytics(params?: DateFilterRange) {
  return useQueries({
    queries: [
      {
        queryKey: ['revenue-analytics', params],
        queryFn: () => analyticsService.getRevenueAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['order-analytics', params],
        queryFn: () => analyticsService.getOrderAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['customer-analytics', params],
        queryFn: () => analyticsService.getCustomerAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['harvest-analytics', params],
        queryFn: () => analyticsService.getHarvestAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['feeding-analytics', params],
        queryFn: () => analyticsService.getFeedingAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['inventory-analytics', params],
        queryFn: () => analyticsService.getInventoryAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['pond-analytics', params],
        queryFn: () => analyticsService.getPondAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['fish-batch-analytics', params],
        queryFn: () => analyticsService.getFishBatchAnalytics(params),
        staleTime: 5 * 60 * 1000,
      },
    ],
  })
}