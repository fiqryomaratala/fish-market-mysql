import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'
import type { ProductListParams } from '@/types/product'

type UseProductsOptions = {
  admin?: boolean
}

export function useProducts(params: ProductListParams = {}, options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ['products', params, options.admin ? 'admin' : 'public'],
    queryFn: async () => productService.getProducts(params, options),
  })
}
