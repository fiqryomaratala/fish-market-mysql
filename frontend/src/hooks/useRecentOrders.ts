import { useQuery } from '@tanstack/react-query'
import { orderService } from '@/services'

export function useRecentOrders() {
  return useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: async () =>
      orderService.getOrders({
        page: 1,
        limit: 5,
      }),
  })
}
