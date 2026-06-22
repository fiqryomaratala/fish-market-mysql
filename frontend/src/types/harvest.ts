export const HARVEST_STATUS_OPTIONS = [
  'Planned',
  'Harvested',
  'Transferred To Inventory',
] as const

export type HarvestStatus = (typeof HARVEST_STATUS_OPTIONS)[number]

export interface Harvest {
  id: number
  harvest_code: string
  fish_batch_id: number
  batch_code: string
  fish_type: string
  pond_name: string
  harvest_date: string
  total_quantity: number
  average_weight: number
  total_weight: number
  survival_rate: number
  status: HarvestStatus
  notes: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface HarvestListMeta {
  page: number
  limit: number
  total: number
}

export interface HarvestListParams {
  page?: number
  limit?: number
  fish_batch_id?: number
  start_date?: string
  end_date?: string
}

export interface HarvestListResult {
  items: Harvest[]
  meta: HarvestListMeta
}

export interface HarvestMutationInput {
  fish_batch_id: number
  harvest_date: string
  total_quantity: number
  average_weight: number
  total_weight: number
  notes: string
  batch_code?: string
  fish_type?: string
  pond_name?: string
  initial_quantity?: number
}

export function normalizeHarvestStatus(value: unknown): HarvestStatus {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (
    normalized === 'transferred to inventory' ||
    normalized === 'transferred_to_inventory' ||
    normalized === 'transferred-to-inventory'
  ) {
    return 'Transferred To Inventory'
  }

  if (normalized === 'planned') {
    return 'Planned'
  }

  return 'Harvested'
}

export function getHarvestStatusClasses(status: HarvestStatus) {
  if (status === 'Planned') {
    return 'border-blue-200 bg-blue-50 text-blue-700'
  }

  if (status === 'Harvested') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  return 'border-purple-200 bg-purple-50 text-purple-700'
}

export function getHarvestStatusDot(status: HarvestStatus) {
  if (status === 'Planned') {
    return 'bg-blue-500'
  }

  if (status === 'Harvested') {
    return 'bg-emerald-500'
  }

  return 'bg-purple-500'
}

