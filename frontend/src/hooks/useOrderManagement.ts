import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderManagementService } from '@/services/order-management.service'
import type {
  OrdersQueryParams,
  UpdateOrderStatusPayload,
} from '@/types/order-management'

const QUERY_KEY = 'order-management'

export function useOrders(params: OrdersQueryParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', params],
    queryFn: () => orderManagementService.getOrders(params),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, 'detail', id],
    queryFn: () => orderManagementService.getOrderById(id),
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateOrderStatusPayload
    }) => orderManagementService.updateOrderStatus(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY] })

      const previousOrders = queryClient.getQueryData([QUERY_KEY, 'list'])
      const previousOrder = queryClient.getQueryData([QUERY_KEY, 'detail', id])

      queryClient.setQueryData([QUERY_KEY, 'detail', id], (old: any) => {
        if (!old) return old
        return {
          ...old,
          status: payload.status,
        }
      })

      return { previousOrders, previousOrder }
    },
    onError: (_err, { id }, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData([QUERY_KEY, 'list'], context.previousOrders)
      }
      if (context?.previousOrder) {
        queryClient.setQueryData([QUERY_KEY, 'detail', id], context.previousOrder)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}
