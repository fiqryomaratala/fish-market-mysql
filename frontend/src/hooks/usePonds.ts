import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { pondService } from '@/services'
import type { Pond, PondListParams, PondListResult, PondMutationInput } from '@/types/pond'

type UpdatePondVariables = {
  id: number
  payload: PondMutationInput
}

function updatePondCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (current: PondListResult) => PondListResult,
) {
  const previousPonds = queryClient.getQueriesData<PondListResult>({
    queryKey: ['ponds'],
  })

  for (const [queryKey, current] of previousPonds) {
    if (!current) {
      continue
    }

    queryClient.setQueryData<PondListResult>(queryKey, updater(current))
  }

  return previousPonds
}

export function usePonds(params?: PondListParams) {
  return useQuery({
    queryKey: ['ponds', params],
    queryFn: async () => pondService.getPonds(params),
  })
}

export function usePond(id?: number) {
  return useQuery({
    queryKey: ['pond', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID kolam tidak valid')
      }

      return pondService.getPond(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreatePond() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PondMutationInput) => pondService.createPond(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['ponds'] })

      const previousPonds = updatePondCaches(queryClient, (current) => {
        const optimisticPond: Pond = {
          id: -Date.now(),
          ...payload,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        return {
          ...current,
          items: [optimisticPond, ...current.items],
          meta: {
            ...current.meta,
            total: current.meta.total + 1,
          },
        }
      })

      return { previousPonds }
    },
    onError: (_error, _payload, context) => {
      for (const [queryKey, previousData] of context?.previousPonds ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ponds'] })
    },
  })
}

export function useUpdatePond() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: UpdatePondVariables) => pondService.updatePond(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['ponds'] })
      await queryClient.cancelQueries({ queryKey: ['pond', id] })

      const previousPond = queryClient.getQueryData<Pond>(['pond', id])
      const previousPonds = updatePondCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...payload,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      }))

      if (previousPond) {
        queryClient.setQueryData<Pond>(['pond', id], {
          ...previousPond,
          ...payload,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousPonds, previousPond }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousPonds ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousPond) {
        queryClient.setQueryData(['pond', variables.id], context.previousPond)
      }
    },
    onSuccess: (updatedPond) => {
      updatePondCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedPond.id ? updatedPond : item)),
      }))

      queryClient.setQueryData(['pond', updatedPond.id], updatedPond)
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['ponds'] })
      await queryClient.invalidateQueries({ queryKey: ['pond', variables.id] })
    },
  })
}

export function useDeletePond() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => pondService.deletePond(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['ponds'] })
      await queryClient.cancelQueries({ queryKey: ['pond', id] })

      const previousPonds = updatePondCaches(queryClient, (current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
        meta: {
          ...current.meta,
          total: Math.max(0, current.meta.total - 1),
        },
      }))

      queryClient.removeQueries({ queryKey: ['pond', id] })

      return { previousPonds }
    },
    onError: (_error, _id, context) => {
      for (const [queryKey, previousData] of context?.previousPonds ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ponds'] })
    },
  })
}
