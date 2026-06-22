import api from '@/api/axios'
import type {
  FishBatch,
  FishBatchListParams,
  FishBatchListResult,
  FishBatchMutationInput,
} from '@/types/fish-batch'
import { getFishBatchStatusApiValue, normalizeFishBatchStatus } from '@/types/fish-batch'

type FishBatchApiRecord = {
  id?: number | string
  batch_code?: string
  fish_type?: string
  pond_id?: number | string
  pond_name?: string
  seed_count?: number | string
  current_count?: number | string
  average_weight?: number | string
  start_date?: string
  stocking_date?: string
  expected_harvest?: string
  estimated_harvest_date?: string
  status?: string
  notes?: string
  created_at?: string
  updated_at?: string
  pond?: {
    id?: number | string
    name?: string
    location?: string
    status?: string
  }
}

type FishBatchListEnvelope = {
  data?:
    | FishBatchApiRecord[]
    | {
        items?: FishBatchApiRecord[]
        meta?: {
          page?: number
          limit?: number
          total?: number
        }
      }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

type FishBatchDetailEnvelope = {
  data?: FishBatchApiRecord
}

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeFishBatch(item: FishBatchApiRecord, fallbackId = 0): FishBatch {
  const id = toNumber(item.id, fallbackId)
  const initialQuantity = toNumber(item.seed_count)
  const currentQuantity = toNumber(item.current_count, initialQuantity)

  return {
    id,
    batch_code: toStringValue(item.batch_code, `BTCH-${String(id || fallbackId || 0).padStart(4, '0')}`),
    fish_type: toStringValue(item.fish_type, '-'),
    pond_id: toNumber(item.pond_id, toNumber(item.pond?.id)),
    pond_name: toStringValue(item.pond_name) || toStringValue(item.pond?.name, '-'),
    initial_quantity: initialQuantity,
    current_quantity: currentQuantity,
    average_weight: toNumber(item.average_weight),
    stocking_date: toStringValue(item.stocking_date) || toStringValue(item.start_date),
    estimated_harvest_date:
      toStringValue(item.estimated_harvest_date) || toStringValue(item.expected_harvest),
    status: normalizeFishBatchStatus(item.status),
    notes: toStringValue(item.notes),
    created_at: toStringValue(item.created_at),
    updated_at: toStringValue(item.updated_at),
  }
}

function toCreatePayload(payload: FishBatchMutationInput) {
  return {
    pond_id: payload.pond_id,
    fish_type: payload.fish_type,
    seed_count: payload.initial_quantity,
    average_weight: payload.average_weight,
    start_date: payload.stocking_date,
    expected_harvest: payload.estimated_harvest_date,
  }
}

function toUpdatePayload(payload: FishBatchMutationInput) {
  return {
    pond_id: payload.pond_id,
    fish_type: payload.fish_type,
    seed_count: payload.initial_quantity,
    current_count: payload.current_quantity,
    average_weight: payload.average_weight,
    start_date: payload.stocking_date,
    expected_harvest: payload.estimated_harvest_date,
    status: getFishBatchStatusApiValue(payload.status),
  }
}

class FishBatchService {
  async getFishBatches(params?: FishBatchListParams): Promise<FishBatchListResult> {
    const query = {
      page: params?.page,
      limit: params?.limit,
      status:
        params?.status && params.status !== 'All'
          ? getFishBatchStatusApiValue(params.status)
          : undefined,
      fish_type: params?.fish_type,
      pond_id: params?.pond_id,
    }
    const { data } = await api.get<FishBatchListEnvelope>('/batches', { params: query })
    const rawItems = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.data?.items)
        ? data.data.items
        : []
    const metaSource = !Array.isArray(data.data) ? data.data?.meta : data.meta
    const items = rawItems.map((item, index) => normalizeFishBatch(item, index + 1))

    return {
      items,
      meta: {
        page: toNumber(metaSource?.page, params?.page ?? DEFAULT_PAGE),
        limit: toNumber(metaSource?.limit, params?.limit ?? DEFAULT_LIMIT),
        total: toNumber(metaSource?.total, items.length),
      },
    }
  }

  async getFishBatch(id: number): Promise<FishBatch> {
    const { data } = await api.get<FishBatchDetailEnvelope>(`/batches/${id}`)

    if (!data.data) {
      throw new Error('Data batch ikan tidak ditemukan')
    }

    return normalizeFishBatch(data.data, id)
  }

  async createFishBatch(payload: FishBatchMutationInput): Promise<FishBatch> {
    const { data } = await api.post<FishBatchDetailEnvelope>('/batches', toCreatePayload(payload))

    if (!data.data) {
      throw new Error('Respons tambah batch ikan tidak valid')
    }

    return normalizeFishBatch(data.data)
  }

  async updateFishBatch(id: number, payload: FishBatchMutationInput): Promise<FishBatch> {
    const { data } = await api.put<FishBatchDetailEnvelope>(`/batches/${id}`, toUpdatePayload(payload))

    if (!data.data) {
      throw new Error('Respons ubah batch ikan tidak valid')
    }

    return normalizeFishBatch(data.data, id)
  }

  async deleteFishBatch(id: number) {
    await api.delete(`/batches/${id}`)
  }
}

export const fishBatchService = new FishBatchService()
