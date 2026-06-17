import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services'
import type { ProductListResult } from '@/types/product'

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => productService.deleteProduct(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      await queryClient.cancelQueries({ queryKey: ['product', id] })

      const previousProducts = queryClient.getQueriesData<ProductListResult>({
        queryKey: ['products'],
      })

      for (const [queryKey, current] of previousProducts) {
        if (!current) {
          continue
        }

        queryClient.setQueryData<ProductListResult>(queryKey, {
          ...current,
          items: current.items.filter((item) => item.id !== id),
          meta: {
            ...current.meta,
            total: Math.max(0, current.meta.total - 1),
          },
        })
      }

      queryClient.removeQueries({ queryKey: ['product', id] })

      return { previousProducts }
    },
    onError: (_error, id, context) => {
      for (const [queryKey, previousData] of context?.previousProducts ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      void queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
