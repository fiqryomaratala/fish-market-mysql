import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { cartService } from '@/services'
import type { AddToCartPayload, CartSummary, UpdateCartPayload } from '@/types/cart'

export const CART_QUERY_KEY = ['cart']

function useCartQueryKey() {
  const { isAuthenticated } = useAuth()

  return [...CART_QUERY_KEY, isAuthenticated ? 'auth' : 'guest']
}

export function useCart() {
  const { isAuthenticated, loading } = useAuth()
  const queryKey = useCartQueryKey()

  return useQuery({
    queryKey,
    queryFn: async () =>
      isAuthenticated ? cartService.getCart() : cartService.getGuestCart(),
    enabled: !loading,
  })
}

export function useAddCart() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async (payload: AddToCartPayload) =>
      isAuthenticated ? cartService.addToCart(payload) : cartService.addGuestToCart(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<CartSummary>(queryKey, data)
    },
  })
}

export function useUpdateCart() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCartPayload }) =>
      isAuthenticated
        ? cartService.updateQuantity(id, payload)
        : cartService.updateGuestQuantity(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<CartSummary>(queryKey, data)
    },
  })
}

export function useDeleteCart() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async (id: number) =>
      isAuthenticated ? cartService.removeItem(id) : cartService.removeGuestItem(id),
    onSuccess: async (data) => {
      if (isAuthenticated) {
        await queryClient.invalidateQueries({ queryKey })
        return
      }

      queryClient.setQueryData<CartSummary>(queryKey, data as CartSummary)
    },
  })
}

export function useClearCart() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async () => (isAuthenticated ? cartService.clearCart() : cartService.clearGuestCart()),
    onSuccess: async (data) => {
      if (isAuthenticated) {
        await queryClient.invalidateQueries({ queryKey })
        return
      }

      queryClient.setQueryData<CartSummary>(queryKey, data as CartSummary)
    },
  })
}
