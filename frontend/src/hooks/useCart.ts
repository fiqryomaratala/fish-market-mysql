import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cartService } from '@/services'
import type { AddToCartPayload, CartSummary, UpdateCartPayload } from '@/types/cart'

export const CART_QUERY_KEY = ['cart']

export function useCart() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: async () => cartService.getCart(),
  })
}

export function useAddCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddToCartPayload) => cartService.addToCart(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<CartSummary>(CART_QUERY_KEY, data)
    },
  })
}

export function useUpdateCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCartPayload }) =>
      cartService.updateQuantity(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<CartSummary>(CART_QUERY_KEY, data)
    },
  })
}

export function useDeleteCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => cartService.removeItem(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => cartService.clearCart(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY })
    },
  })
}
