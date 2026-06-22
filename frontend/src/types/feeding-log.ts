export interface FeedingLog {
  id: number
  fish_batch_id: number
  batch_code: string
  fish_type: string
  pond_name: string
  feed_name: string
  feed_type: string
  quantity: number
  feeding_time: string
  notes: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface FeedingLogListMeta {
  page: number
  limit: number
  total: number
}

export interface FeedingLogListParams {
  page?: number
  limit?: number
  fish_batch_id?: number
  start_date?: string
  end_date?: string
}

export interface FeedingLogListResult {
  items: FeedingLog[]
  meta: FeedingLogListMeta
}

export interface FeedingLogMutationInput {
  fish_batch_id: number
  feed_type: string
  feed_amount: number
  feed_time: string
  notes: string
  batch_code?: string
  fish_type?: string
  pond_name?: string
  feed_name?: string
  created_by?: string
}

export type FeedingSession = 'Morning Feeding' | 'Afternoon Feeding' | 'Evening Feeding'

export function getFeedingSession(feedingTime: string): FeedingSession {
  const date = new Date(feedingTime)

  if (Number.isNaN(date.getTime())) {
    return 'Morning Feeding'
  }

  const hour = date.getHours()

  if (hour < 12) {
    return 'Morning Feeding'
  }

  if (hour < 17) {
    return 'Afternoon Feeding'
  }

  return 'Evening Feeding'
}

export function getFeedingSessionClasses(session: FeedingSession) {
  if (session === 'Morning Feeding') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  if (session === 'Afternoon Feeding') {
    return 'border-cyan-200 bg-cyan-50 text-cyan-700'
  }

  return 'border-slate-200 bg-slate-100 text-slate-700'
}
