import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useProducts(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => productService.getAll(params),
  })
}
