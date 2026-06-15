import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { checkoutService } from '@/services/checkout.service'
import type { CheckoutRequest } from '@/types/checkout'

export function useCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CheckoutRequest) => checkoutService.checkout(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['cart'] }),
        queryClient.invalidateQueries({ queryKey: ['orders'] }),
      ])
    },
  })
}

export function useOrderDetail(orderId?: string) {
  return useQuery({
    queryKey: ['order-detail', orderId],
    queryFn: async () => checkoutService.getOrderById(orderId ?? ''),
    enabled: Boolean(orderId),
  })
}
