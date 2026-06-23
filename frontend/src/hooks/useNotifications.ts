import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { notificationService } from '@/services'
import type { ListQueryParams } from '@/types/api'
import type { NotificationItem, NotificationsResult } from '@/types/notification'

const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const

function updateNotificationLists(
  queryClient: QueryClient,
  updater: (current: NotificationsResult) => NotificationsResult,
) {
  queryClient.setQueriesData<NotificationsResult>(
    { queryKey: NOTIFICATIONS_QUERY_KEY },
    (current) => {
      if (!current) {
        return current
      }

      return updater(current)
    },
  )
}

function replaceNotificationDetail(
  queryClient: QueryClient,
  id: number,
  updater: (current: NotificationItem | undefined) => NotificationItem | undefined,
) {
  queryClient.setQueriesData<NotificationItem>(
    { queryKey: ['notification', id] },
    (current) => updater(current),
  )
}

export function useNotifications(params: ListQueryParams = {}) {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => notificationService.getNotifications(params),
  })
}

export function useNotification(id?: number | null, initialData?: NotificationItem | null) {
  return useQuery({
    queryKey: ['notification', id],
    queryFn: () => notificationService.getNotification(id as number),
    enabled: Boolean(id),
    initialData: initialData ?? undefined,
  })
}

export function useMarkAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      await queryClient.cancelQueries({ queryKey: ['notification', id] })

      const previousNotifications = queryClient.getQueriesData<NotificationsResult>({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      })
      const previousDetail = queryClient.getQueryData<NotificationItem>(['notification', id])

      updateNotificationLists(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? {
                ...item,
                is_read: true,
              }
            : item,
        ),
      }))

      replaceNotificationDetail(queryClient, id, (current) =>
        current
          ? {
              ...current,
              is_read: true,
            }
          : current,
      )

      return {
        previousNotifications,
        previousDetail,
      }
    },
    onError: (_error, id, context) => {
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      if (context?.previousDetail) {
        queryClient.setQueryData(['notification', id], context.previousDetail)
      }
    },
    onSettled: async (_data, _error, id) => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      await queryClient.invalidateQueries({ queryKey: ['notification', id] })
    },
  })
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      await queryClient.cancelQueries({ queryKey: ['notification'] })

      const previousNotifications = queryClient.getQueriesData<NotificationsResult>({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      })
      const previousDetails = queryClient.getQueriesData<NotificationItem>({
        queryKey: ['notification'],
      })

      updateNotificationLists(queryClient, (current) => ({
        ...current,
        items: current.items.map((item) => ({
          ...item,
          is_read: true,
        })),
      }))

      queryClient.setQueriesData<NotificationItem>({ queryKey: ['notification'] }, (current) =>
        current
          ? {
              ...current,
              is_read: true,
            }
          : current,
      )

      return {
        previousNotifications,
        previousDetails,
      }
    },
    onError: (_error, _variables, context) => {
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      context?.previousDetails.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      await queryClient.invalidateQueries({ queryKey: ['notification'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => notificationService.deleteNotification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      await queryClient.cancelQueries({ queryKey: ['notification', id] })

      const previousNotifications = queryClient.getQueriesData<NotificationsResult>({
        queryKey: NOTIFICATIONS_QUERY_KEY,
      })
      const previousDetail = queryClient.getQueryData<NotificationItem>(['notification', id])

      updateNotificationLists(queryClient, (current) => ({
        ...current,
        items: current.items.filter((item) => item.id !== id),
        meta: {
          ...current.meta,
          total: Math.max(0, current.meta.total - (current.items.some((item) => item.id === id) ? 1 : 0)),
          total_pages: Math.max(
            1,
            Math.ceil(
              Math.max(0, current.meta.total - (current.items.some((item) => item.id === id) ? 1 : 0)) /
                Math.max(1, current.meta.limit),
            ),
          ),
        },
      }))

      queryClient.removeQueries({ queryKey: ['notification', id], exact: true })

      return {
        previousNotifications,
        previousDetail,
      }
    },
    onError: (_error, id, context) => {
      context?.previousNotifications.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      if (context?.previousDetail) {
        queryClient.setQueryData(['notification', id], context.previousDetail)
      }
    },
    onSettled: async (_data, _error, id) => {
      await queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
      queryClient.removeQueries({ queryKey: ['notification', id], exact: true })
    },
  })
}
