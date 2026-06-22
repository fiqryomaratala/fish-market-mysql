import api from '@/api/axios'
import type { Pond, PondListParams, PondListResult, PondMutationInput } from '@/types/pond'

type PondApiRecord = Partial<Pond> & {
  area?: number | string
  water_type?: string
  description?: string
}

type PondListEnvelope = {
  data?:
    | PondApiRecord[]
    | {
        items?: PondApiRecord[]
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
  message?: string
}

type PondDetailEnvelope = {
  data?: PondApiRecord
  message?: string
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

function normalizeStatus(value: unknown): Pond['status'] {
  const normalized = toStringValue(value).trim().toLowerCase()

  if (normalized === 'maintenance') {
    return 'Maintenance'
  }

  if (normalized === 'inactive') {
    return 'Inactive'
  }

  return 'Active'
}

function normalizePond(item: PondApiRecord, fallbackId = 0): Pond {
  const id = toNumber(item.id, fallbackId)
  const area = toNumber(item.area)

  return {
    id,
    name: toStringValue(item.name, `Kolam ${id || ''}`.trim()),
    code: toStringValue(item.code, `KLM-${String(id || fallbackId || 0).padStart(3, '0')}`),
    location: toStringValue(item.location, '-'),
    length: toNumber(item.length, area > 0 ? area : 0),
    width: toNumber(item.width),
    depth: toNumber(item.depth),
    capacity: toNumber(item.capacity),
    water_source: toStringValue(item.water_source) || toStringValue(item.water_type, '-'),
    status: normalizeStatus(item.status),
    created_at: toStringValue(item.created_at),
    updated_at: toStringValue(item.updated_at),
  }
}

class PondService {
  async getPonds(params?: PondListParams): Promise<PondListResult> {
    const { data } = await api.get<PondListEnvelope>('/ponds', { params })
    const rawItems = Array.isArray(data.data)
      ? data.data
      : Array.isArray(data.data?.items)
        ? data.data.items
        : []
    const metaSource = !Array.isArray(data.data) ? data.data?.meta : data.meta
    const items = rawItems.map((item, index) => normalizePond(item, index + 1))

    return {
      items,
      meta: {
        page: toNumber(metaSource?.page, params?.page ?? DEFAULT_PAGE),
        limit: toNumber(metaSource?.limit, params?.limit ?? DEFAULT_LIMIT),
        total: toNumber(metaSource?.total, items.length),
      },
    }
  }

  async getPond(id: number): Promise<Pond> {
    const { data } = await api.get<PondDetailEnvelope>(`/ponds/${id}`)

    if (!data.data) {
      throw new Error('Data kolam tidak ditemukan')
    }

    return normalizePond(data.data, id)
  }

  async createPond(payload: PondMutationInput): Promise<Pond> {
    const { data } = await api.post<PondDetailEnvelope>('/ponds', payload)

    if (!data.data) {
      throw new Error('Respons tambah kolam tidak valid')
    }

    return normalizePond(data.data)
  }

  async updatePond(id: number, payload: PondMutationInput): Promise<Pond> {
    const { data } = await api.put<PondDetailEnvelope>(`/ponds/${id}`, payload)

    if (!data.data) {
      throw new Error('Respons ubah kolam tidak valid')
    }

    return normalizePond(data.data, id)
  }

  async deletePond(id: number) {
    await api.delete(`/ponds/${id}`)
  }
}

export const pondService = new PondService()
