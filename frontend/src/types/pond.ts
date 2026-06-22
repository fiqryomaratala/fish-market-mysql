export const POND_STATUS_OPTIONS = ['Active', 'Maintenance', 'Inactive'] as const

export type PondStatus = (typeof POND_STATUS_OPTIONS)[number]

export interface Pond {
  id: number
  name: string
  code: string
  location: string
  length: number
  width: number
  depth: number
  capacity: number
  water_source: string
  status: PondStatus
  created_at: string
  updated_at: string
}

export interface PondListMeta {
  page: number
  limit: number
  total: number
}

export interface PondListParams {
  page?: number
  limit?: number
  search?: string
  status?: PondStatus | 'All'
}

export interface PondListResult {
  items: Pond[]
  meta: PondListMeta
}

export interface PondMutationInput {
  name: string
  code: string
  location: string
  length: number
  width: number
  depth: number
  capacity: number
  water_source: string
  status: PondStatus
}

export function getPondStatusClasses(status: PondStatus) {
  if (status === 'Active') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (status === 'Maintenance') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-slate-200 bg-slate-100 text-slate-700'
}

export function getPondStatusDot(status: PondStatus) {
  if (status === 'Active') {
    return 'bg-emerald-500'
  }

  if (status === 'Maintenance') {
    return 'bg-amber-500'
  }

  return 'bg-slate-400'
}
