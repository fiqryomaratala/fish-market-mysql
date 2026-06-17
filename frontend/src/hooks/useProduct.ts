import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'

export function useProduct(productId?: number | string) {
  const numericId = Number(productId)

  return useQuery({
    queryKey: ['product', numericId],
    queryFn: async () => {
      if (!productId || Number.isNaN(numericId)) {
        throw new Error('Product ID is required')
      }

      return productService.getProduct(numericId)
    },
    enabled: Boolean(productId) && !Number.isNaN(numericId),
  })
}
