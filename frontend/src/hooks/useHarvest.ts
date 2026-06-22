import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { harvestService } from '@/services/harvest.service'
import type {
  Harvest,
  HarvestListParams,
  HarvestListResult,
  HarvestMutationInput,
} from '@/types/harvest'

type UpdateHarvestVariables = {
  id: number
  payload: HarvestMutationInput
}

function updateHarvestCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (current: HarvestListResult) => HarvestListResult,
) {
  const previousHarvests = queryClient.getQueriesData<HarvestListResult>({
    queryKey: ['harvests'],
  })

  for (const [queryKey, current] of previousHarvests) {
    if (!current) {
      continue
    }

    queryClient.setQueryData<HarvestListResult>(queryKey, updater(current))
  }

  return previousHarvests
}

export function useHarvests(params?: HarvestListParams) {
  return useQuery({
    queryKey: ['harvests', params],
    queryFn: async () => harvestService.getHarvests(params),
  })
}

export function useHarvest(id?: number) {
  return useQuery({
    queryKey: ['harvest', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID panen tidak valid')
      }

      return harvestService.getHarvest(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateHarvest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: HarvestMutationInput) => harvestService.createHarvest(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['harvests'] })

      const previousHarvests = updateHarvestCaches(queryClient, (current) => {
        const optimisticHarvest: Harvest = {
          id: -Date.now(),
          harvest_code: `HRV-${String(current.meta.total + 1).padStart(4, '0')}`,
          fish_batch_id: payload.fish_batch_id,
          batch_code: payload.batch_code ?? '-',
          fish_type: payload.fish_type ?? '-',
          pond_name: payload.pond_name ?? '-',
          harvest_date: payload.harvest_date,
          total_quantity: payload.total_quantity,
          average_weight: payload.average_weight,
          total_weight: payload.total_weight,
          survival_rate:
            payload.initial_quantity && payload.initial_quantity > 0
              ? Math.max(0, Math.min(100, (payload.total_quantity / payload.initial_quantity) * 100))
              : 0,
          status: 'Harvested',
          notes: payload.notes,
          created_by: 'Anda',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        return {
          ...current,
          items: [optimisticHarvest, ...current.items],
          meta: {
            ...current.meta,
            total: current.meta.total + 1,
          },
        }
      })

      return { previousHarvests }
    },
    onError: (_error, _payload, context) => {
      for (const [queryKey, previousData] of context?.previousHarvests ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['harvests'] })
      await queryClient.invalidateQueries({ queryKey: ['fish-batches'] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useUpdateHarvest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateHarvestVariables) => harvestService.updateHarvest(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['harvests'] })
      await queryClient.cancelQueries({ queryKey: ['harvest', id] })

      const previousHarvest = queryClient.getQueryData<Harvest>(['harvest', id])
      const previousHarvests = updateHarvestCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                fish_batch_id: payload.fish_batch_id,
                batch_code: payload.batch_code ?? item.batch_code,
                fish_type: payload.fish_type ?? item.fish_type,
                pond_name: payload.pond_name ?? item.pond_name,
                harvest_date: payload.harvest_date,
                total_quantity: payload.total_quantity,
                average_weight: payload.average_weight,
                total_weight: payload.total_weight,
                survival_rate:
                  payload.initial_quantity && payload.initial_quantity > 0
                    ? Math.max(0, Math.min(100, (payload.total_quantity / payload.initial_quantity) * 100))
                    : item.survival_rate,
                notes: payload.notes,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      }))

      if (previousHarvest) {
        queryClient.setQueryData<Harvest>(['harvest', id], {
          ...previousHarvest,
          fish_batch_id: payload.fish_batch_id,
          batch_code: payload.batch_code ?? previousHarvest.batch_code,
          fish_type: payload.fish_type ?? previousHarvest.fish_type,
          pond_name: payload.pond_name ?? previousHarvest.pond_name,
          harvest_date: payload.harvest_date,
          total_quantity: payload.total_quantity,
          average_weight: payload.average_weight,
          total_weight: payload.total_weight,
          survival_rate:
            payload.initial_quantity && payload.initial_quantity > 0
              ? Math.max(0, Math.min(100, (payload.total_quantity / payload.initial_quantity) * 100))
              : previousHarvest.survival_rate,
          notes: payload.notes,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousHarvests, previousHarvest }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousHarvests ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousHarvest) {
        queryClient.setQueryData(['harvest', variables.id], context.previousHarvest)
      }
    },
    onSuccess: (updatedHarvest) => {
      updateHarvestCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedHarvest.id ? updatedHarvest : item)),
      }))

      queryClient.setQueryData(['harvest', updatedHarvest.id], updatedHarvest)
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['harvests'] })
      await queryClient.invalidateQueries({ queryKey: ['harvest', variables.id] })
      await queryClient.invalidateQueries({ queryKey: ['fish-batches'] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useDeleteHarvest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => harvestService.deleteHarvest(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['harvests'] })
      await queryClient.cancelQueries({ queryKey: ['harvest', id] })

      const previousHarvests = updateHarvestCaches(queryClient, (current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
        meta: {
          ...current.meta,
          total: Math.max(0, current.meta.total - 1),
        },
      }))

      queryClient.removeQueries({ queryKey: ['harvest', id] })

      return { previousHarvests }
    },
    onError: (_error, _id, context) => {
      for (const [queryKey, previousData] of context?.previousHarvests ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['harvests'] })
      await queryClient.invalidateQueries({ queryKey: ['fish-batches'] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useTransferHarvest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => harvestService.transferToInventory(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['harvests'] })
      await queryClient.cancelQueries({ queryKey: ['harvest', id] })

      const previousHarvest = queryClient.getQueryData<Harvest>(['harvest', id])
      const previousHarvests = updateHarvestCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'Transferred To Inventory',
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      }))

      if (previousHarvest) {
        queryClient.setQueryData<Harvest>(['harvest', id], {
          ...previousHarvest,
          status: 'Transferred To Inventory',
          updated_at: new Date().toISOString(),
        })
      }

      return { previousHarvests, previousHarvest }
    },
    onError: (_error, id, context) => {
      for (const [queryKey, previousData] of context?.previousHarvests ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousHarvest) {
        queryClient.setQueryData(['harvest', id], context.previousHarvest)
      }
    },
    onSuccess: (updatedHarvest) => {
      updateHarvestCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedHarvest.id ? updatedHarvest : item)),
      }))

      queryClient.setQueryData(['harvest', updatedHarvest.id], updatedHarvest)
    },
    onSettled: async (_data, _error, id) => {
      await queryClient.invalidateQueries({ queryKey: ['harvests'] })
      await queryClient.invalidateQueries({ queryKey: ['harvest', id] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}
