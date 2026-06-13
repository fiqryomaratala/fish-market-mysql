import { useQuery } from '@tanstack/react-query'
import { harvestService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useHarvest(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['harvest', params],
    queryFn: async () => harvestService.getAll(params),
  })
}
