import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useOrders(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => orderService.getAll(params),
  })
}
