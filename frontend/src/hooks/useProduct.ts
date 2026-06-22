import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'

type UseProductOptions = {
  admin?: boolean
}

export function useProduct(productId?: number | string, options: UseProductOptions = {}) {
  const numericId = Number(productId)

  return useQuery({
    queryKey: ['product', numericId, options.admin ? 'admin' : 'public'],
    queryFn: async () => {
      if (!productId || Number.isNaN(numericId)) {
        throw new Error('Product ID is required')
      }

      return productService.getProduct(numericId, options)
    },
    enabled: Boolean(productId) && !Number.isNaN(numericId),
  })
}
