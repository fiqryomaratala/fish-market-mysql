import api from '@/api/axios'
import type { ApiResponse } from '@/types/auth'
import type {
  ActivityLog,
  ActivityLogApiItem,
  ActivityLogListMeta,
  ActivityLogListParams,
  ActivityLogListResult,
} from '@/types/activity-log'

type ActivityLogsEnvelope = {
  items?: ActivityLogApiItem[]
  meta?: Partial<ActivityLogListMeta>
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeActivityLog(item: ActivityLogApiItem): ActivityLog {
  return {
    id: toNumber(item.id),
    user_name: toText(item.user_name || item.user, 'Sistem'),
    user_role: toText(item.user_role).toLowerCase(),
    action: toText(item.action, '-'),
    module: toText(item.module, '-'),
    description: toText(item.description, '-'),
    ip_address: toText(item.ip_address, '-'),
    created_at: toText(item.created_at),
  }
}

class ActivityLogService {
  async getActivityLogs(params: ActivityLogListParams = {}): Promise<ActivityLogListResult> {
    const safePage = params.page ?? 1
    const safeLimit = params.limit ?? 10
    const { data } = await api.get<ApiResponse<ActivityLogsEnvelope>>('/activity-logs', {
      params: {
        page: safePage,
        limit: safeLimit,
        module: params.module,
        action: params.action,
        user_id: params.user_id,
      },
    })

    return {
      items: Array.isArray(data.data?.items)
        ? data.data.items.map(normalizeActivityLog)
        : [],
      meta: {
        page: toNumber(data.data?.meta?.page, safePage),
        limit: toNumber(data.data?.meta?.limit, safeLimit),
        total: toNumber(data.data?.meta?.total),
      },
    }
  }

  async getActivityLog(id: number | string): Promise<ActivityLog> {
    const { data } = await api.get<ApiResponse<ActivityLogApiItem>>(`/activity-logs/${id}`)
    return normalizeActivityLog(data.data ?? {})
  }
}

export const activityLogService = new ActivityLogService()
