import { useQuery } from '@tanstack/react-query'
import { productService } from '@/services'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => productService.getProducts(),
  })
}
