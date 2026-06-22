import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fishBatchService } from '@/services'
import type {
  FishBatch,
  FishBatchListParams,
  FishBatchListResult,
  FishBatchMutationInput,
} from '@/types/fish-batch'

type UpdateFishBatchVariables = {
  id: number
  payload: FishBatchMutationInput
}

function updateFishBatchCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (current: FishBatchListResult) => FishBatchListResult,
) {
  const previousBatches = queryClient.getQueriesData<FishBatchListResult>({
    queryKey: ['fish-batches'],
  })

  for (const [queryKey, current] of previousBatches) {
    if (!current) {
      continue
    }

    queryClient.setQueryData<FishBatchListResult>(queryKey, updater(current))
  }

  return previousBatches
}

export function useFishBatches(params?: FishBatchListParams) {
  return useQuery({
    queryKey: ['fish-batches', params],
    queryFn: async () => fishBatchService.getFishBatches(params),
  })
}

export function useFishBatch(id?: number) {
  return useQuery({
    queryKey: ['fish-batch', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID batch ikan tidak valid')
      }

      return fishBatchService.getFishBatch(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateFishBatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FishBatchMutationInput) => fishBatchService.createFishBatch(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['fish-batches'] })

      const previousBatches = updateFishBatchCaches(queryClient, (current) => {
        const optimisticBatch: FishBatch = {
          id: -Date.now(),
          ...payload,
          pond_name: current.items.find((item) => item.pond_id === payload.pond_id)?.pond_name ?? '-',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        return {
          ...current,
          items: [optimisticBatch, ...current.items],
          meta: {
            ...current.meta,
            total: current.meta.total + 1,
          },
        }
      })

      return { previousBatches }
    },
    onError: (_error, _payload, context) => {
      for (const [queryKey, previousData] of context?.previousBatches ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['fish-batches'] })
    },
  })
}

export function useUpdateFishBatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateFishBatchVariables) =>
      fishBatchService.updateFishBatch(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['fish-batches'] })
      await queryClient.cancelQueries({ queryKey: ['fish-batch', id] })

      const previousBatch = queryClient.getQueryData<FishBatch>(['fish-batch', id])
      const previousBatches = updateFishBatchCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...payload,
                pond_name: item.pond_id === payload.pond_id ? item.pond_name : item.pond_name,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      }))

      if (previousBatch) {
        queryClient.setQueryData<FishBatch>(['fish-batch', id], {
          ...previousBatch,
          ...payload,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousBatches, previousBatch }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousBatches ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousBatch) {
        queryClient.setQueryData(['fish-batch', variables.id], context.previousBatch)
      }
    },
    onSuccess: (updatedBatch) => {
      updateFishBatchCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedBatch.id ? updatedBatch : item)),
      }))

      queryClient.setQueryData(['fish-batch', updatedBatch.id], updatedBatch)
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['fish-batches'] })
      await queryClient.invalidateQueries({ queryKey: ['fish-batch', variables.id] })
    },
  })
}

export function useDeleteFishBatch() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => fishBatchService.deleteFishBatch(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['fish-batches'] })
      await queryClient.cancelQueries({ queryKey: ['fish-batch', id] })

      const previousBatches = updateFishBatchCaches(queryClient, (current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
        meta: {
          ...current.meta,
          total: Math.max(0, current.meta.total - 1),
        },
      }))

      queryClient.removeQueries({ queryKey: ['fish-batch', id] })

      return { previousBatches }
    },
    onError: (_error, _id, context) => {
      for (const [queryKey, previousData] of context?.previousBatches ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['fish-batches'] })
    },
  })
}
