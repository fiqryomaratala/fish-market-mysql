import api from '@/api/axios'
import type {
  Harvest,
  HarvestListParams,
  HarvestListResult,
  HarvestMutationInput,
} from '@/types/harvest'
import { normalizeHarvestStatus } from '@/types/harvest'

type HarvestBatchApiRecord = {
  id?: number | string
  batch_code?: string
  fish_type?: string
  status?: string
  current_count?: number | string
}

type HarvestApiRecord = {
  id?: number | string
  harvest_code?: string
  fish_batch_id?: number | string
  harvest_date?: string
  total_weight?: number | string
  fish_count?: number | string
  total_quantity?: number | string
  average_weight?: number | string
  survival_rate?: number | string
  status?: string
  notes?: string
  created_by?: string
  created_at?: string
  updated_at?: string
  fish_batch?: HarvestBatchApiRecord
}

type HarvestListEnvelope = {
  data?:
    | HarvestApiRecord[]
    | {
        items?: HarvestApiRecord[]
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

type HarvestDetailEnvelope = {
  data?: HarvestApiRecord
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function createHarvestCode(id: number, rawCode?: string) {
  if (rawCode?.trim()) {
    return rawCode.trim()
  }

  return `HRV-${String(id).padStart(4, '0')}`
}

function normalizeHarvest(item: HarvestApiRecord, fallbackId = 0): Harvest {
  const id = toNumber(item.id, fallbackId)
  const totalQuantity = toNumber(item.total_quantity, toNumber(item.fish_count))
  const averageWeight = toNumber(item.average_weight)
  const totalWeight =
    toNumber(item.total_weight) || (totalQuantity > 0 && averageWeight > 0 ? totalQuantity * averageWeight : 0)

  return {
    id,
    harvest_code: createHarvestCode(id, toStringValue(item.harvest_code)),
    fish_batch_id: toNumber(item.fish_batch_id, toNumber(item.fish_batch?.id)),
    batch_code: toStringValue(item.fish_batch?.batch_code, '-'),
    fish_type: toStringValue(item.fish_batch?.fish_type, '-'),
    pond_name: '-',
    harvest_date: toStringValue(item.harvest_date),
    total_quantity: totalQuantity,
    average_weight: averageWeight,
    total_weight: totalWeight,
    survival_rate: toNumber(item.survival_rate),
    status: normalizeHarvestStatus(item.status || item.fish_batch?.status),
    notes: toStringValue(item.notes),
    created_by: toStringValue(item.created_by, '-'),
    created_at: toStringValue(item.created_at),
    updated_at: toStringValue(item.updated_at),
  }
}

function toApiPayload(payload: HarvestMutationInput) {
  return {
    fish_batch_id: payload.fish_batch_id,
    harvest_date: payload.harvest_date,
    total_weight: payload.total_weight,
    fish_count: payload.total_quantity,
    average_weight: payload.average_weight,
    notes: payload.notes,
  }
}

class HarvestService {
  async getHarvests(params: HarvestListParams = {}): Promise<HarvestListResult> {
    const { data } = await api.get<HarvestListEnvelope>('/harvests', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 1000,
        fish_batch_id: params.fish_batch_id,
        start_date: params.start_date,
        end_date: params.end_date,
      },
    })

    const rawItems = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.data?.items)
        ? data.data.items
        : []
    const metaSource = !Array.isArray(data.data) ? data.data?.meta : data.meta
    const items = rawItems.map((item, index) => normalizeHarvest(item, index + 1))

    return {
      items,
      meta: {
        page: toNumber(metaSource?.page, params.page ?? 1),
        limit: toNumber(metaSource?.limit, params.limit ?? 1000),
        total: toNumber(metaSource?.total, items.length),
      },
    }
  }

  async getHarvest(id: number): Promise<Harvest> {
    const { data } = await api.get<HarvestDetailEnvelope>(`/harvests/${id}`)

    if (!data.data) {
      throw new Error('Data panen tidak ditemukan')
    }

    return normalizeHarvest(data.data, id)
  }

  async createHarvest(payload: HarvestMutationInput): Promise<Harvest> {
    const { data } = await api.post<HarvestDetailEnvelope>('/harvests', toApiPayload(payload))

    if (!data.data) {
      throw new Error('Respons tambah panen tidak valid')
    }

    return normalizeHarvest(data.data)
  }

  async updateHarvest(id: number, payload: HarvestMutationInput): Promise<Harvest> {
    const { data } = await api.put<HarvestDetailEnvelope>(`/harvests/${id}`, toApiPayload(payload))

    if (!data.data) {
      throw new Error('Respons ubah panen tidak valid')
    }

    return normalizeHarvest(data.data, id)
  }

  async deleteHarvest(id: number) {
    await api.delete(`/harvests/${id}`)
  }

  async transferToInventory(id: number): Promise<Harvest> {
    const { data } = await api.post<HarvestDetailEnvelope>(`/harvests/${id}/transfer`)

    if (!data.data) {
      throw new Error('Respons transfer panen tidak valid')
    }

    return {
      ...normalizeHarvest(data.data, id),
      status: 'Transferred To Inventory',
    }
  }
}

export const harvestService = new HarvestService()

