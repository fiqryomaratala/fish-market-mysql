import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useReports(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['reports', params],
    queryFn: async () => reportService.getAll(params),
  })
}
