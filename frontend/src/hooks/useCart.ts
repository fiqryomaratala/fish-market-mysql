import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { cartService } from '@/services'
import type { AddToCartPayload, CartSummary, UpdateCartPayload } from '@/types/cart'

export const CART_QUERY_KEY = ['cart']

function useCanUseServerCart() {
  const { isAuthenticated, role } = useAuth()

  return isAuthenticated && role === 'customer'
}

function useCartQueryKey() {
  const canUseServerCart = useCanUseServerCart()

  return [...CART_QUERY_KEY, canUseServerCart ? 'auth' : 'guest']
}

export function useCart() {
  const { loading } = useAuth()
  const canUseServerCart = useCanUseServerCart()
  const queryKey = useCartQueryKey()

  return useQuery({
    queryKey,
    queryFn: async () =>
      canUseServerCart ? cartService.getCart() : cartService.getGuestCart(),
    enabled: !loading,
  })
}

export function useAddCart() {
  const canUseServerCart = useCanUseServerCart()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async (payload: AddToCartPayload) =>
      canUseServerCart ? cartService.addToCart(payload) : cartService.addGuestToCart(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<CartSummary>(queryKey, data)
    },
  })
}

export function useUpdateCart() {
  const canUseServerCart = useCanUseServerCart()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCartPayload }) =>
      canUseServerCart
        ? cartService.updateQuantity(id, payload)
        : cartService.updateGuestQuantity(id, payload),
    onSuccess: (data) => {
      queryClient.setQueryData<CartSummary>(queryKey, data)
    },
  })
}

export function useDeleteCart() {
  const canUseServerCart = useCanUseServerCart()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async (id: number) =>
      canUseServerCart ? cartService.removeItem(id) : cartService.removeGuestItem(id),
    onSuccess: async (data) => {
      if (canUseServerCart) {
        await queryClient.invalidateQueries({ queryKey })
        return
      }

      queryClient.setQueryData<CartSummary>(queryKey, data as CartSummary)
    },
  })
}

export function useClearCart() {
  const canUseServerCart = useCanUseServerCart()
  const queryClient = useQueryClient()
  const queryKey = useCartQueryKey()

  return useMutation({
    mutationFn: async () =>
      canUseServerCart ? cartService.clearCart() : cartService.clearGuestCart(),
    onSuccess: async (data) => {
      if (canUseServerCart) {
        await queryClient.invalidateQueries({ queryKey })
        return
      }

      queryClient.setQueryData<CartSummary>(queryKey, data as CartSummary)
    },
  })
}
