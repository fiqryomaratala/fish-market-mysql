import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'

export function useProduct(productId?: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const numericId = Number(productId)

      if (!productId || Number.isNaN(numericId)) {
        throw new Error('Product ID is required')
      }

      return productService.getProductById(numericId)
    },
    enabled: Boolean(productId),
  })
}
