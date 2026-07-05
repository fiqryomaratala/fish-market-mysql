import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services'
import type { OrdersQueryParams } from '@/types/order'

export function useOrders(params: OrdersQueryParams = {}) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: async () => orderService.getOrders(params),
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: async (_, orderId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
        queryClient.invalidateQueries({ queryKey: ['order-detail', orderId] }),
      ])
    },
  })
}
