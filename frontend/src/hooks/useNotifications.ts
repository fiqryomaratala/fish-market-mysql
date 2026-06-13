import { useQuery } from '@tanstack/react-query'
import { notificationService } from '@/services'
import type { ListQueryParams } from '@/types/api'

export function useNotifications(params?: ListQueryParams) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => notificationService.getAll(params),
  })
}
