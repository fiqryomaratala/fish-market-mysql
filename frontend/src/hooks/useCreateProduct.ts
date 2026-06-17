import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '@/services'
import type { Product, ProductListResult, ProductMutationInput } from '@/types/product'

type ProductsSnapshot = Array<[readonly unknown[], ProductListResult | undefined]>

function updateProductCaches(
  snapshots: ProductsSnapshot,
  updater: (current: ProductListResult, queryKey: readonly unknown[]) => ProductListResult,
  queryClient: QueryClient,
) {
  for (const [queryKey, current] of snapshots) {
    if (!current) {
      continue
    }

    queryClient.setQueryData<ProductListResult>(queryKey, updater(current, queryKey))
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProductMutationInput) => productService.createProduct(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })

      const previousProducts = queryClient.getQueriesData<ProductListResult>({
        queryKey: ['products'],
      })

      const optimisticProduct: Product = {
        id: -Date.now(),
        name: payload.name,
        description: payload.description,
        price: payload.price,
        stock: payload.stock,
        category: payload.category,
        weight: payload.weight,
        image_url: payload.image ? URL.createObjectURL(payload.image) : payload.image_url ?? '',
        status: payload.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        batch_code: '',
        farm_name: '',
        pond_name: '',
        harvest_date: '',
      }

      updateProductCaches(
        previousProducts,
        (current, queryKey) => {
          const [, params] = queryKey as [string, { page?: number; limit?: number } | undefined]
          const page = params?.page ?? current.meta.page
          const limit = params?.limit ?? current.meta.limit

          if (page !== 1) {
            return {
              ...current,
              meta: { ...current.meta, total: current.meta.total + 1 },
            }
          }

          return {
            items: [optimisticProduct, ...current.items].slice(0, limit),
            meta: { ...current.meta, total: current.meta.total + 1 },
          }
        },
        queryClient,
      )

      return { previousProducts, optimisticProduct }
    },
    onError: (_error, _payload, context) => {
      for (const [queryKey, previousData] of context?.previousProducts ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSuccess: (createdProduct, _payload, context) => {
      const optimisticId = context?.optimisticProduct.id
      const cachedProducts = queryClient.getQueriesData<ProductListResult>({
        queryKey: ['products'],
      })

      updateProductCaches(
        cachedProducts,
        (current) => ({
          ...current,
          items: current.items.map((item) =>
            item.id === optimisticId ? createdProduct : item,
          ),
        }),
        queryClient,
      )

      queryClient.setQueryData(['product', createdProduct.id], createdProduct)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
