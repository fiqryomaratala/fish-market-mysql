import { useQuery } from '@tanstack/react-query'
import { inventoryService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useInventory(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['inventory', params],
    queryFn: async () => inventoryService.getAll(params),
  })
}
