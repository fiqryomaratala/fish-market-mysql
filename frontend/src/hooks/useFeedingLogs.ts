import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedingLogService } from '@/services/feeding-log.service'
import type {
  FeedingLog,
  FeedingLogListParams,
  FeedingLogListResult,
  FeedingLogMutationInput,
} from '@/types/feeding-log'

type UpdateFeedingLogVariables = {
  id: number
  payload: FeedingLogMutationInput
}

function updateFeedingLogCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  updater: (current: FeedingLogListResult) => FeedingLogListResult,
) {
  const previousLogs = queryClient.getQueriesData<FeedingLogListResult>({
    queryKey: ['feeding-logs'],
  })

  for (const [queryKey, current] of previousLogs) {
    if (!current) {
      continue
    }

    queryClient.setQueryData<FeedingLogListResult>(queryKey, updater(current))
  }

  return previousLogs
}

export function useFeedingLogs(params?: FeedingLogListParams) {
  return useQuery({
    queryKey: ['feeding-logs', params],
    queryFn: async () => feedingLogService.getFeedingLogs(params),
  })
}

export function useFeedingLog(id?: number) {
  return useQuery({
    queryKey: ['feeding-log', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('ID log pakan tidak valid')
      }

      return feedingLogService.getFeedingLog(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateFeedingLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: FeedingLogMutationInput) => feedingLogService.createFeedingLog(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['feeding-logs'] })

      const previousLogs = updateFeedingLogCaches(queryClient, (current) => {
        const optimisticLog: FeedingLog = {
          id: -Date.now(),
          fish_batch_id: payload.fish_batch_id,
          batch_code: payload.batch_code ?? '-',
          fish_type: payload.fish_type ?? '-',
          pond_name: payload.pond_name ?? '-',
          feed_name: payload.feed_name ?? payload.feed_type,
          feed_type: payload.feed_type,
          quantity: payload.feed_amount,
          feeding_time: payload.feed_time,
          notes: payload.notes,
          created_by: payload.created_by ?? 'Anda',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        return {
          ...current,
          items: [optimisticLog, ...current.items],
          meta: {
            ...current.meta,
            total: current.meta.total + 1,
          },
        }
      })

      return { previousLogs }
    },
    onError: (_error, _payload, context) => {
      for (const [queryKey, previousData] of context?.previousLogs ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feeding-logs'] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useUpdateFeedingLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateFeedingLogVariables) =>
      feedingLogService.updateFeedingLog(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['feeding-logs'] })
      await queryClient.cancelQueries({ queryKey: ['feeding-log', id] })

      const previousLog = queryClient.getQueryData<FeedingLog>(['feeding-log', id])
      const previousLogs = updateFeedingLogCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                fish_batch_id: payload.fish_batch_id,
                batch_code: payload.batch_code ?? item.batch_code,
                fish_type: payload.fish_type ?? item.fish_type,
                pond_name: payload.pond_name ?? item.pond_name,
                feed_name: payload.feed_name ?? payload.feed_type,
                feed_type: payload.feed_type,
                quantity: payload.feed_amount,
                feeding_time: payload.feed_time,
                notes: payload.notes,
                updated_at: new Date().toISOString(),
              }
            : item,
        ),
      }))

      if (previousLog) {
        queryClient.setQueryData<FeedingLog>(['feeding-log', id], {
          ...previousLog,
          fish_batch_id: payload.fish_batch_id,
          batch_code: payload.batch_code ?? previousLog.batch_code,
          fish_type: payload.fish_type ?? previousLog.fish_type,
          pond_name: payload.pond_name ?? previousLog.pond_name,
          feed_name: payload.feed_name ?? payload.feed_type,
          feed_type: payload.feed_type,
          quantity: payload.feed_amount,
          feeding_time: payload.feed_time,
          notes: payload.notes,
          updated_at: new Date().toISOString(),
        })
      }

      return { previousLogs, previousLog }
    },
    onError: (_error, variables, context) => {
      for (const [queryKey, previousData] of context?.previousLogs ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }

      if (context?.previousLog) {
        queryClient.setQueryData(['feeding-log', variables.id], context.previousLog)
      }
    },
    onSuccess: (updatedLog) => {
      updateFeedingLogCaches(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => (item.id === updatedLog.id ? updatedLog : item)),
      }))

      queryClient.setQueryData(['feeding-log', updatedLog.id], updatedLog)
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['feeding-logs'] })
      await queryClient.invalidateQueries({ queryKey: ['feeding-log', variables.id] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}

export function useDeleteFeedingLog() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => feedingLogService.deleteFeedingLog(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['feeding-logs'] })
      await queryClient.cancelQueries({ queryKey: ['feeding-log', id] })

      const previousLogs = updateFeedingLogCaches(queryClient, (current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
        meta: {
          ...current.meta,
          total: Math.max(0, current.meta.total - 1),
        },
      }))

      queryClient.removeQueries({ queryKey: ['feeding-log', id] })

      return { previousLogs }
    },
    onError: (_error, _id, context) => {
      for (const [queryKey, previousData] of context?.previousLogs ?? []) {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feeding-logs'] })
      await queryClient.invalidateQueries({ queryKey: ['inventories'] })
    },
  })
}
