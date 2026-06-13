import { useQuery } from '@tanstack/react-query'
import { fishBatchService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useFishBatches(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['fish-batches', params],
    queryFn: async () => fishBatchService.getAll(params),
  })
}
