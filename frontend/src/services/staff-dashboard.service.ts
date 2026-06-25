import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  StaffDashboard,
  StaffDashboardActivity,
  StaffFeedUsagePoint,
  StaffFishBatchStatusPoint,
  StaffHarvestSchedulePoint,
  StaffInventoryAlert,
  StaffTask,
  StaffUpcomingHarvest,
} from '@/types/staff-dashboard'

type StaffDashboardApiResponse = Partial<StaffDashboard> & {
  recent_activities?: unknown[]
  upcoming_harvests?: unknown[]
  inventory_alerts?: unknown[]
  harvest_schedule?: unknown[]
  feed_usage_trend?: unknown[]
  fish_batch_status?: unknown[]
  today_tasks?: unknown[]
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function unwrapResponse(
  payload: ApiResponse<StaffDashboardApiResponse> | StaffDashboardApiResponse,
): StaffDashboardApiResponse {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data ?? {}
  }

  return payload ?? {}
}

function mapActivity(item: unknown, index: number): StaffDashboardActivity {
  const record = typeof item === 'object' && item !== null ? item : {}

  return {
    id: toStringValue((record as { id?: unknown }).id, `${index + 1}`),
    user: toStringValue((record as { user?: unknown }).user, 'System'),
    action: toStringValue((record as { action?: unknown }).action, 'activity'),
    module: toStringValue((record as { module?: unknown }).module, 'dashboard'),
    time: toStringValue(
      (record as { time?: unknown; created_at?: unknown }).time ??
        (record as { created_at?: unknown }).created_at,
    ),
  }
}

function calculateDaysRemaining(value: string) {
  const target = new Date(value)
  if (Number.isNaN(target.getTime())) {
    return undefined
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function mapHarvest(item: unknown, index: number): StaffUpcomingHarvest {
  const record = typeof item === 'object' && item !== null ? item : {}
  const harvestDate = toStringValue((record as { harvest_date?: unknown }).harvest_date)
  const rawDaysRemaining = (record as { days_remaining?: unknown }).days_remaining
  const daysRemaining =
    rawDaysRemaining === undefined
      ? calculateDaysRemaining(harvestDate)
      : toNumber(rawDaysRemaining, calculateDaysRemaining(harvestDate) ?? 0)

  return {
    id: toStringValue((record as { id?: unknown }).id, `${index + 1}`),
    batch_code: toStringValue((record as { batch_code?: unknown }).batch_code, '-'),
    fish_type: toStringValue(
      (record as { fish_type?: unknown; species?: unknown }).fish_type ??
        (record as { species?: unknown }).species,
      '-',
    ),
    pond: toStringValue((record as { pond?: unknown }).pond, '-'),
    harvest_date: harvestDate,
    days_remaining: daysRemaining,
  }
}

function mapInventoryAlert(item: unknown, index: number): StaffInventoryAlert {
  const record = typeof item === 'object' && item !== null ? item : {}
  const currentStock = toNumber(
    (record as { current_stock?: unknown; quantity?: unknown }).current_stock ??
      (record as { quantity?: unknown }).quantity,
  )
  const minimumStock = toNumber(
    (record as { minimum_stock?: unknown; min_stock?: unknown }).minimum_stock ??
      (record as { min_stock?: unknown }).min_stock,
  )

  return {
    id: toStringValue((record as { id?: unknown }).id, `${index + 1}`),
    feed_name: toStringValue(
      (record as { feed_name?: unknown; product?: unknown }).feed_name ??
        (record as { product?: unknown }).product,
      '-',
    ),
    current_stock: currentStock,
    minimum_stock: minimumStock,
    status:
      currentStock <= 0
        ? 'Out Of Stock'
        : toStringValue((record as { status?: unknown }).status, 'Low Stock'),
  }
}

function mapHarvestSchedulePoint(item: unknown): StaffHarvestSchedulePoint {
  const record = typeof item === 'object' && item !== null ? item : {}

  return {
    week: toStringValue(
      (record as { week?: unknown; label?: unknown }).week ??
        (record as { label?: unknown }).label,
      '-',
    ),
    total: toNumber(
      (record as { total?: unknown; value?: unknown }).total ??
        (record as { value?: unknown }).value,
    ),
  }
}

function mapFeedUsagePoint(item: unknown): StaffFeedUsagePoint {
  const record = typeof item === 'object' && item !== null ? item : {}

  return {
    date: toStringValue(
      (record as { date?: unknown; day?: unknown }).date ?? (record as { day?: unknown }).day,
      '-',
    ),
    amount: toNumber(
      (record as { amount?: unknown; total?: unknown }).amount ??
        (record as { total?: unknown }).total,
    ),
  }
}

function mapBatchStatusPoint(item: unknown): StaffFishBatchStatusPoint {
  const record = typeof item === 'object' && item !== null ? item : {}

  return {
    name: toStringValue(
      (record as { name?: unknown; status?: unknown }).name ??
        (record as { status?: unknown }).status,
      '-',
    ),
    value: toNumber(
      (record as { value?: unknown; total?: unknown }).value ??
        (record as { total?: unknown }).total,
    ),
  }
}

function mapTask(item: unknown, index: number): StaffTask {
  const record = typeof item === 'object' && item !== null ? item : {}

  return {
    id: toStringValue((record as { id?: unknown }).id, `task-${index + 1}`),
    title: toStringValue((record as { title?: unknown }).title, 'Task'),
    description: toStringValue((record as { description?: unknown }).description, ''),
    status: toStringValue((record as { status?: unknown }).status, 'Pending') as StaffTask['status'],
    deadline: toStringValue((record as { deadline?: unknown }).deadline, 'Hari ini'),
    priority: toStringValue((record as { priority?: unknown }).priority, 'Medium') as StaffTask['priority'],
  }
}

class StaffDashboardService {
  async getStaffDashboard(): Promise<StaffDashboard> {
    const { data } = await api.get<
      ApiResponse<StaffDashboardApiResponse> | StaffDashboardApiResponse
    >('/dashboard/staff')
    const payload = unwrapResponse(data)

    return {
      total_ponds: toNumber(payload.total_ponds),
      active_ponds: toNumber(payload.active_ponds),
      total_batches: toNumber(payload.total_batches),
      growing_batches: toNumber(payload.growing_batches),
      ready_to_harvest: toNumber(payload.ready_to_harvest),
      today_feedings: toNumber(payload.today_feedings),
      today_harvests: toNumber(payload.today_harvests),
      low_stock_feeds: toNumber(payload.low_stock_feeds),
      recent_activities: Array.isArray(payload.recent_activities)
        ? payload.recent_activities.map(mapActivity)
        : [],
      upcoming_harvests: Array.isArray(payload.upcoming_harvests)
        ? payload.upcoming_harvests.map(mapHarvest)
        : [],
      inventory_alerts: Array.isArray(payload.inventory_alerts)
        ? payload.inventory_alerts.map(mapInventoryAlert)
        : [],
      harvest_schedule: Array.isArray(payload.harvest_schedule)
        ? payload.harvest_schedule.map(mapHarvestSchedulePoint)
        : [],
      feed_usage_trend: Array.isArray(payload.feed_usage_trend)
        ? payload.feed_usage_trend.map(mapFeedUsagePoint)
        : [],
      fish_batch_status: Array.isArray(payload.fish_batch_status)
        ? payload.fish_batch_status.map(mapBatchStatusPoint)
        : [],
      today_tasks: Array.isArray(payload.today_tasks) ? payload.today_tasks.map(mapTask) : [],
    }
  }
}

export const staffDashboardService = new StaffDashboardService()
