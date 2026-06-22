import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from '@/services'
import type {
  Inventory,
  InventoryAdjustmentInput,
  InventoryListResult,
  InventoryMovement,
  InventoryMutationInput,
} from '@/types/inventory'

type UpdateInventoryVariables = {
  id: number
  payload: InventoryMutationInput
}

function updateInventoryCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (current: InventoryListResult) => InventoryListResult,
) {
  const previousInventories = queryClient.getQueriesData<InventoryListResult>({
    queryKey: ['inventories'],
  })

  for (const [queryKey, current] of previousInventories) {
    if (!current) {
      continue
    }

    queryClient.setQueryData<InventoryListResult>(queryKey, updater(current))
  }

  return previousInventories
}

export function useInventories(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['inventories', params],
    queryFn: async () => inventoryService.getInventories(params),
  })
}

export function useInventory(id?: number) {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Inventory ID tidak valid')
      }

      return inventoryService.getInventory(id)
    },
    enabled: Boolean(id),
  })
}

export function useInventoryMovements() {
  return useQuery({
    queryKey: ['inventory-movements'],
    queryFn: async () => inventoryService.getMovements(),
  })
}

export function useCreateInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: InventoryMutationInput) => inventoryService.createInventory(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['inventories'] })

      const previousInventories = updateInventoryCaches(queryClient, (current) => {
        const optimisticInventory: Inventory = {
          id: -Date.now(),
          name: payload.name,
          category: payload.category,
          sku: payload.sku,
          unit: payload.unit,
          stock: payload.stock,
          minimum_stock: payload.minimum_stock,
          status:
            payload.stock <= 0
              ? 'out_of_stock'
              : payload.stock <= payload.minimum_stock
                ? 'low_stock'
                : 'available',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        return {
          ...current,
          items: [optimisticInventory, ...current.items],
          meta: { ...current.meta, total: current.meta.total + 1 },
        }
      })

      return { previousInventories }
    },
    onError: (_error, _payload, context) => {
      for (const [queryKey, previousData] of context?.previousInventories ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useUpdateInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateInventoryVariables) =>
      inventoryService.updateInventory(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['inventories'] })
      await queryClient.cancelQueries({ queryKey: ['inventory', id] })

      const previousInventory = queryClient.getQueryData<Inventory>(['inventory', id])
      const previousInventories = updateInventoryCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                name: payload.name,
                category: payload.category,
                sku: payload.sku,
                unit: payload.unit,
                stock: payload.stock,
                minimum_stock: payload.minimum_stock,
                status:
                  payload.stock <= 0
                    ? 'out_of_stock'
                    : payload.stock <= payload.minimum_stock
                      ? 'low_stock'
                      : 'available',
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      }))

      if (previousInventory) {
        queryClient.setQueryData<Inventory>(['inventory', id], {
          ...previousInventory,
          name: payload.name,
          category: payload.category,
          sku: payload.sku,
          unit: payload.unit,
          stock: payload.stock,
          minimum_stock: payload.minimum_stock,
          status:
            payload.stock <= 0
              ? 'out_of_stock'
              : payload.stock <= payload.minimum_stock
                ? 'low_stock'
                : 'available',
          updated_at: new Date().toISOString(),
        })
      }

      return { previousInventories, previousInventory }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousInventories ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousInventory) {
        queryClient.setQueryData(['inventory', variables.id], context.previousInventory)
      }
    },
    onSuccess: (updatedInventory) => {
      updateInventoryCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedInventory.id ? updatedInventory : item)),
      }))
      queryClient.setQueryData(['inventory', updatedInventory.id], updatedInventory)
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
      await queryClient.invalidateQueries({ queryKey: ['inventory', variables.id] })
    },
  })
}

export function useDeleteInventory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => inventoryService.deleteInventory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['inventories'] })
      await queryClient.cancelQueries({ queryKey: ['inventory', id] })

      const previousInventories = updateInventoryCaches(queryClient, (current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
        meta: {
          ...current.meta,
          total: Math.max(0, current.meta.total - 1),
        },
      }))

      queryClient.removeQueries({ queryKey: ['inventory', id] })

      return { previousInventories }
    },
    onError: (_error, _id, context) => {
      for (const [queryKey, previousData] of context?.previousInventories ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: InventoryAdjustmentInput) => inventoryService.adjustStock(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['inventories'] })
      await queryClient.cancelQueries({ queryKey: ['inventory', payload.inventory_id] })
      await queryClient.cancelQueries({ queryKey: ['inventory-movements'] })

      const previousInventory = queryClient.getQueryData<Inventory>(['inventory', payload.inventory_id])
      const previousMovements = queryClient.getQueryData<InventoryMovement[]>(['inventory-movements'])
      const delta = payload.type === 'stock_in' ? payload.quantity : payload.quantity * -1

      const previousInventories = updateInventoryCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => {
          if (item.id !== payload.inventory_id) {
            return item
          }

          const stock = Math.max(0, item.stock + delta)
          return {
            ...item,
            stock,
            status:
              stock <= 0
                ? 'out_of_stock'
                : stock <= item.minimum_stock
                  ? 'low_stock'
                  : 'available',
            updated_at: new Date().toISOString(),
          }
        }),
      }))

      if (previousInventory) {
        const stock = Math.max(0, previousInventory.stock + delta)
        queryClient.setQueryData<Inventory>(['inventory', payload.inventory_id], {
          ...previousInventory,
          stock,
          status:
            stock <= 0
              ? 'out_of_stock'
              : stock <= previousInventory.minimum_stock
                ? 'low_stock'
                : 'available',
          updated_at: new Date().toISOString(),
        })
      }

      if (previousMovements) {
        queryClient.setQueryData<InventoryMovement[]>(['inventory-movements'], [
          {
            id: -Date.now(),
            inventory_id: payload.inventory_id,
            date: new Date().toISOString(),
            item: previousInventory?.name || 'Inventaris',
            movement_type: payload.type === 'stock_in' ? 'IN' : 'OUT',
            quantity: payload.quantity,
            reason: payload.reason,
            created_by: 'Anda',
            reference: 'MANUAL-ADJUSTMENT',
          },
          ...previousMovements,
        ])
      }

      return { previousInventories, previousInventory, previousMovements }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousInventories ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousInventory) {
        queryClient.setQueryData(['inventory', variables.inventory_id], context.previousInventory)
      }

      if (context?.previousMovements) {
        queryClient.setQueryData(['inventory-movements'], context.previousMovements)
      }
    },
    onSuccess: (updatedInventory, variables) => {
      updateInventoryCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedInventory.id ? updatedInventory : item)),
      }))

      queryClient.setQueryData(['inventory', updatedInventory.id], updatedInventory)
      void queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
      void queryClient.invalidateQueries({ queryKey: ['inventory', variables.inventory_id] })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
      await queryClient.invalidateQueries({ queryKey: ['inventory-movements'] })
    },
  })
}
