export const INVENTORY_CATEGORIES = ['Fish', 'Feed', 'Medicine', 'Equipment'] as const
export const INVENTORY_STATUS_OPTIONS = ['available', 'low_stock', 'out_of_stock'] as const
export const INVENTORY_MOVEMENT_TYPES = ['IN', 'OUT', 'ADJUSTMENT'] as const

export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number]
export type InventoryStatus = (typeof INVENTORY_STATUS_OPTIONS)[number]
export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPES)[number]

export interface Inventory {
  id: number
  name: string
  category: string
  sku: string
  unit: string
  stock: number
  minimum_stock: number
  status: string
  created_at: string
  updated_at: string
  product_id?: number
  fish_batch_id?: number
}

export interface InventoryMovement {
  id: number
  inventory_id: number
  date: string
  item: string
  movement_type: InventoryMovementType
  quantity: number
  reason: string
  created_by: string
  reference: string
}

export interface InventoryListMeta {
  page: number
  limit: number
  total: number
}

export interface InventoryListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}

export interface InventoryListResult {
  items: Inventory[]
  meta: InventoryListMeta
}

export interface InventoryMutationInput {
  name: string
  sku: string
  category: string
  unit: string
  stock: number
  minimum_stock: number
}

export interface InventoryStockTransactionInput {
  inventory_id: number
  type: 'stock_in' | 'stock_out'
  quantity: number
  reason: string
  reference?: string
}

export type InventoryAdjustmentInput = InventoryStockTransactionInput
export type InventoryOperationalTransactionInput = InventoryStockTransactionInput

export interface InventoryApiItem {
  id: number
  product_id?: number
  product?: string
  fish_batch_id?: number
  batch_code?: string
  quantity?: number
  unit?: string
  status?: string
  created_at?: string
  updated_at?: string
  name?: string
  category?: string
  sku?: string
  stock?: number
  minimum_stock?: number
}

export interface InventoryMovementApiItem {
  id: number
  inventory_id: number
  type: string
  quantity: number
  description?: string
  reference?: string
  product?: string
  batch_code?: string
  created_at?: string
  created_by?: string
}

export function getInventoryStatus(stock: number, minimumStock: number): InventoryStatus {
  if (stock <= 0) {
    return 'out_of_stock'
  }

  if (stock <= minimumStock) {
    return 'low_stock'
  }

  return 'available'
}

export function getInventoryStatusLabel(status: string) {
  if (status === 'low_stock') {
    return 'Stok Menipis'
  }

  if (status === 'out_of_stock') {
    return 'Stok Habis'
  }

  return 'Tersedia'
}

export function getInventoryStatusClasses(status: string) {
  if (status === 'low_stock') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  if (status === 'out_of_stock') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-emerald-200 bg-emerald-50 text-emerald-700'
}

export function getInventoryMovementLabel(type: string) {
  if (type === 'IN') {
    return 'Stok Masuk'
  }

  if (type === 'OUT') {
    return 'Stok Keluar'
  }

  return 'Penyesuaian'
}

export function getInventoryMovementClasses(type: string) {
  if (type === 'IN') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (type === 'OUT') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-cyan-200 bg-cyan-50 text-cyan-700'
}
