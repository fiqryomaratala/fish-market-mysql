import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error('Product ID is required')
      }

      return productService.getById(productId)
    },
    enabled: Boolean(productId),
  })
}
