import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { activityLogService } from '@/services/activity-log.service'
import type { ActivityLogListParams } from '@/types/activity-log'

export function useActivityLogs(params: ActivityLogListParams = {}) {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['activity-logs', params],
    queryFn: () => activityLogService.getActivityLogs(params),
    enabled: role === 'admin',
    retry: false,
  })
}

export function useActivityLog(id: number | null) {
  const { role } = useAuth()

  return useQuery({
    queryKey: ['activity-logs', 'detail', id],
    queryFn: () => activityLogService.getActivityLog(id!),
    enabled: role === 'admin' && id !== null,
    retry: false,
  })
}
