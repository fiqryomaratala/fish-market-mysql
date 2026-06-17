import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'
import type { ProductListParams } from '@/types/product'

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => productService.getProducts(params),
  })
}
