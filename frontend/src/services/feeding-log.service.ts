import api from '@/api/axios'
import type {
  FeedingLog,
  FeedingLogListParams,
  FeedingLogListResult,
  FeedingLogMutationInput,
} from '@/types/feeding-log'

type FeedingLogBatchApi = {
  id?: number
  batch_code?: string
  fish_type?: string
}

type FeedingLogApiRecord = {
  id?: number
  fish_batch_id?: number
  feed_type?: string
  feed_amount?: number
  feed_time?: string
  notes?: string
  created_by?: string
  created_at?: string
  updated_at?: string
  fish_batch?: FeedingLogBatchApi
}

type FeedingLogListApiResponse = {
  message: string
  data?: {
    items?: FeedingLogApiRecord[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
}

type FeedingLogItemApiResponse = {
  message: string
  data?: FeedingLogApiRecord
}

function normalizeFeedingLog(item: FeedingLogApiRecord, fallbackId = 0): FeedingLog {
  const id = item.id ?? fallbackId
  const feedType = item.feed_type?.trim() || '-'

  return {
    id,
    fish_batch_id: item.fish_batch_id ?? item.fish_batch?.id ?? 0,
    batch_code: item.fish_batch?.batch_code?.trim() || '-',
    fish_type: item.fish_batch?.fish_type?.trim() || '-',
    pond_name: '',
    feed_name: feedType,
    feed_type: feedType,
    quantity: Number(item.feed_amount ?? 0),
    feeding_time: item.feed_time || '',
    notes: item.notes?.trim() || '',
    created_by: item.created_by?.trim() || '',
    created_at: item.created_at || '',
    updated_at: item.updated_at || '',
  }
}

function toApiPayload(payload: FeedingLogMutationInput) {
  return {
    fish_batch_id: payload.fish_batch_id,
    feed_type: payload.feed_type,
    feed_amount: payload.feed_amount,
    feed_time: payload.feed_time,
    notes: payload.notes,
  }
}

class FeedingLogService {
  async getFeedingLogs(params: FeedingLogListParams = {}): Promise<FeedingLogListResult> {
    const { data } = await api.get<FeedingLogListApiResponse>('/feeding-logs', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 1000,
        fish_batch_id: params.fish_batch_id,
        start_date: params.start_date,
        end_date: params.end_date,
      },
    })

    const items = (data.data?.items ?? []).map((item, index) => normalizeFeedingLog(item, index + 1))

    return {
      items,
      meta: {
        page: data.data?.meta?.page ?? params.page ?? 1,
        limit: data.data?.meta?.limit ?? params.limit ?? 1000,
        total: data.data?.meta?.total ?? items.length,
      },
    }
  }

  async getFeedingLog(id: number): Promise<FeedingLog> {
    const { data } = await api.get<FeedingLogItemApiResponse>(`/feeding-logs/${id}`)

    if (!data.data) {
      throw new Error('Data log pakan tidak ditemukan')
    }

    return normalizeFeedingLog(data.data, id)
  }

  async createFeedingLog(payload: FeedingLogMutationInput): Promise<FeedingLog> {
    const { data } = await api.post<FeedingLogItemApiResponse>('/feeding-logs', toApiPayload(payload))

    if (!data.data) {
      throw new Error('Respons tambah log pakan tidak valid')
    }

    return normalizeFeedingLog(data.data)
  }

  async updateFeedingLog(id: number, payload: FeedingLogMutationInput): Promise<FeedingLog> {
    const { data } = await api.put<FeedingLogItemApiResponse>(`/feeding-logs/${id}`, toApiPayload(payload))

    if (!data.data) {
      throw new Error('Respons ubah log pakan tidak valid')
    }

    return normalizeFeedingLog(data.data, id)
  }

  async deleteFeedingLog(id: number) {
    await api.delete(`/feeding-logs/${id}`)
  }
}

export const feedingLogService = new FeedingLogService()
