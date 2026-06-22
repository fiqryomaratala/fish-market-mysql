export const FISH_BATCH_STATUS_OPTIONS = [
  'Stocking',
  'Growing',
  'Ready To Harvest',
  'Harvested',
] as const

export const FISH_TYPE_OPTIONS = ['Nila', 'Lele', 'Patin', 'Gurame', 'Bawal', 'Bandeng'] as const

export type FishBatchStatus = (typeof FISH_BATCH_STATUS_OPTIONS)[number]
export type FishTypeOption = (typeof FISH_TYPE_OPTIONS)[number]

export interface FishBatch {
  id: number
  batch_code: string
  fish_type: string
  pond_id: number
  pond_name: string
  initial_quantity: number
  current_quantity: number
  average_weight: number
  stocking_date: string
  estimated_harvest_date: string
  status: FishBatchStatus
  notes: string
  created_at: string
  updated_at: string
}

export interface FishBatchListMeta {
  page: number
  limit: number
  total: number
}

export interface FishBatchListParams {
  page?: number
  limit?: number
  status?: FishBatchStatus | 'All'
  fish_type?: string
  pond_id?: number
}

export interface FishBatchListResult {
  items: FishBatch[]
  meta: FishBatchListMeta
}

export interface FishBatchMutationInput {
  batch_code: string
  fish_type: string
  pond_id: number
  initial_quantity: number
  current_quantity: number
  average_weight: number
  stocking_date: string
  estimated_harvest_date: string
  status: FishBatchStatus
  notes: string
}

export function normalizeFishBatchStatus(value: unknown): FishBatchStatus {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()

  if (normalized === 'stocking') {
    return 'Stocking'
  }

  if (normalized === 'ready to harvest' || normalized === 'ready_to_harvest' || normalized === 'ready-to-harvest') {
    return 'Ready To Harvest'
  }

  if (normalized === 'harvested' || normalized === 'inactive') {
    return 'Harvested'
  }

  if (normalized === 'active' || normalized === 'growing') {
    return 'Growing'
  }

  return 'Growing'
}

export function getFishBatchStatusClasses(status: FishBatchStatus) {
  if (status === 'Stocking') {
    return 'border-blue-200 bg-blue-50 text-blue-700'
  }

  if (status === 'Growing') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (status === 'Ready To Harvest') {
    return 'border-orange-200 bg-orange-50 text-orange-700'
  }

  return 'border-slate-200 bg-slate-100 text-slate-700'
}

export function getFishBatchStatusDot(status: FishBatchStatus) {
  if (status === 'Stocking') {
    return 'bg-blue-500'
  }

  if (status === 'Growing') {
    return 'bg-emerald-500'
  }

  if (status === 'Ready To Harvest') {
    return 'bg-orange-500'
  }

  return 'bg-slate-400'
}

export function getFishBatchStatusApiValue(status: FishBatchStatus) {
  if (status === 'Ready To Harvest') {
    return 'ready to harvest'
  }

  return status.toLowerCase()
}

export function calculateSurvivalRate(batch: Pick<FishBatch, 'initial_quantity' | 'current_quantity'>) {
  if (batch.initial_quantity <= 0) {
    return 0
  }

  return Math.max(0, Math.min(100, (batch.current_quantity / batch.initial_quantity) * 100))
}

export function calculateGrowthProgress(batch: Pick<FishBatch, 'stocking_date' | 'estimated_harvest_date'>) {
  const start = new Date(batch.stocking_date)
  const end = new Date(batch.estimated_harvest_date)
  const today = new Date()

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return 0
  }

  const total = end.getTime() - start.getTime()
  const elapsed = today.getTime() - start.getTime()

  return Math.max(0, Math.min(100, (elapsed / total) * 100))
}

export function calculateDaysRemaining(estimatedHarvestDate: string) {
  const harvestDate = new Date(estimatedHarvestDate)

  if (Number.isNaN(harvestDate.getTime())) {
    return null
  }

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  harvestDate.setHours(0, 0, 0, 0)

  return Math.ceil((harvestDate.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24))
}
