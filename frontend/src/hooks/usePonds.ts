import { useQuery } from '@tanstack/react-query'
import { pondService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function usePonds(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['ponds', params],
    queryFn: async () => pondService.getAll(params),
  })
}
