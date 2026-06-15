import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services'
import type { OrdersQueryParams } from '@/types/order'

export function useOrders(params: OrdersQueryParams = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => orderService.getOrders(params),
  })
}
