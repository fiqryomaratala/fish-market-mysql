import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services'
import type { Product, ProductListResult, ProductMutationInput } from '@/types/product'

type UpdateProductVariables = {
  id: number
  payload: ProductMutationInput
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateProductVariables) =>
      productService.updateProduct(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      await queryClient.cancelQueries({ queryKey: ['product', id] })

      const previousProducts = queryClient.getQueriesData<ProductListResult>({
        queryKey: ['products'],
      })
      const previousProduct = queryClient.getQueryData<Product>(['product', id])

      const optimisticProduct: Product = {
        id,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
        category: payload.category,
        weight: payload.weight,
        image_url:
          payload.image
            ? URL.createObjectURL(payload.image)
            : payload.image_url ?? previousProduct?.image_url ?? '',
        status: payload.status,
        created_at: previousProduct?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
        batch_code: previousProduct?.batch_code ?? '',
        farm_name: previousProduct?.farm_name ?? '',
        pond_name: previousProduct?.pond_name ?? '',
        harvest_date: previousProduct?.harvest_date ?? '',
      }

      for (const [queryKey, current] of previousProducts) {
        if (!current) {
          continue
        }

        queryClient.setQueryData<ProductListResult>(queryKey, {
          ...current,
          items: current.items.map((item) => (item.id === id ? optimisticProduct : item)),
        })
      }

      queryClient.setQueryData(['product', id], optimisticProduct)

      return { previousProducts, previousProduct }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousProducts ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousProduct) {
        queryClient.setQueryData(['product', variables.id], context.previousProduct)
      }
    },
    onSuccess: (updatedProduct) => {
      const cachedProducts = queryClient.getQueriesData<ProductListResult>({
        queryKey: ['products'],
      })

      for (const [queryKey, current] of cachedProducts) {
        if (!current) {
          continue
        }

        queryClient.setQueryData<ProductListResult>(queryKey, {
          ...current,
          items: current.items.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item,
          ),
        })
      }

      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct)
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
      await queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
  })
}
