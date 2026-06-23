import { AxiosError } from 'axios'
import api from '@/api/axios'
import { productService } from '@/services/product.service'
import type { ProductListResult } from '@/types/product'
import {
  getInventoryStatus,
  type Inventory,
  type InventoryAdjustmentInput,
  type InventoryApiItem,
  type InventoryListParams,
  type InventoryListResult,
  type InventoryMovement,
  type InventoryMovementApiItem,
  type InventoryMutationInput,
  type InventoryOperationalTransactionInput,
} from '@/types/inventory'

type InventoryListApiResponse = {
  message: string
  data: {
    items: InventoryApiItem[]
    meta?: {
      page: number
      limit: number
      total: number
    }
  }
}

type InventoryItemApiResponse = {
  message: string
  data: InventoryApiItem
}

type InventoryMovementApiResponse = {
  message: string
  data: InventoryMovementApiItem[]
}

function normalizeCategory(category?: string) {
  if (!category) {
    return 'Fish'
  }

  const normalized = category.trim()
  if (normalized === 'Fish' || normalized === 'Feed' || normalized === 'Medicine' || normalized === 'Equipment') {
    return normalized
  }

  return 'Fish'
}

function normalizeInventory(
  item: InventoryApiItem,
  productMap?: Map<number, { name: string; category: string }>,
): Inventory {
  const relatedProduct = item.product_id ? productMap?.get(item.product_id) : undefined
  const stock = item.stock ?? item.quantity ?? 0
  const minimumStock = item.minimum_stock ?? 5

  return {
    id: item.id,
    name: item.name || item.product || relatedProduct?.name || `Inventaris #${item.id}`,
    category: normalizeCategory(item.category || relatedProduct?.category),
    sku: item.sku || item.batch_code || `INV-${item.id}`,
    unit: item.unit || 'kg',
    stock,
    minimum_stock: minimumStock,
    status: getInventoryStatus(stock, minimumStock),
    created_at: item.created_at || '',
    updated_at: item.updated_at || item.created_at || '',
    product_id: item.product_id,
    fish_batch_id: item.fish_batch_id,
  }
}

function normalizeMovement(item: InventoryMovementApiItem): InventoryMovement {
  const type =
    item.type === 'IN' || item.type === 'OUT' || item.type === 'ADJUSTMENT'
      ? item.type
      : 'ADJUSTMENT'

  return {
    id: item.id,
    inventory_id: item.inventory_id,
    date: item.created_at || '',
    item: item.product || item.batch_code || `Inventaris #${item.inventory_id}`,
    movement_type: type,
    quantity: item.quantity,
    reason: item.description || 'Tanpa keterangan',
    created_by: item.created_by || 'Sistem',
    reference: item.reference || item.batch_code || 'Tanpa referensi',
  }
}

async function getProductMap() {
  try {
    const products = await productService.getProducts({ page: 1, limit: 1000 })

    return new Map(
      (products.items as ProductListResult['items']).map((product) => [
        product.id,
        {
          name: product.name,
          category: product.category,
        },
      ]),
    )
  } catch {
    return new Map<number, { name: string; category: string }>()
  }
}

class InventoryService {
  async getInventories(params: InventoryListParams = {}): Promise<InventoryListResult> {
    const [response, productMap] = await Promise.all([
      api.get<InventoryListApiResponse>('/inventory', {
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 1000,
        },
      }),
      getProductMap(),
    ])

    return {
      items: response.data.data.items.map((item) => normalizeInventory(item, productMap)),
      meta: response.data.data.meta ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 1000,
        total: response.data.data.items.length,
      },
    }
  }

  async getInventory(id: number): Promise<Inventory> {
    const [response, productMap] = await Promise.all([
      api.get<InventoryItemApiResponse>(`/inventory/${id}`),
      getProductMap(),
    ])

    return normalizeInventory(response.data.data, productMap)
  }

  async createInventory(payload: InventoryMutationInput): Promise<Inventory> {
    const { data } = await api.post<InventoryItemApiResponse>('/inventory', payload)
    return normalizeInventory(data.data)
  }

  async updateInventory(id: number, payload: InventoryMutationInput): Promise<Inventory> {
    const { data } = await api.put<InventoryItemApiResponse>(`/inventory/${id}`, payload)
    return normalizeInventory(data.data)
  }

  async deleteInventory(id: number) {
    await api.delete(`/inventory/${id}`)
  }

  async adjustStock(payload: InventoryAdjustmentInput): Promise<Inventory> {
    const { data } = await api.post<InventoryItemApiResponse>('/inventory/adjustment', {
      inventory_id: payload.inventory_id,
      quantity: payload.type === 'stock_in' ? payload.quantity : payload.quantity * -1,
      description: payload.reason,
    })

    return normalizeInventory(data.data)
  }

  async recordOperationalTransaction(payload: InventoryOperationalTransactionInput): Promise<Inventory> {
    const { data } = await api.post<InventoryItemApiResponse>('/inventory/transactions', {
      inventory_id: payload.inventory_id,
      type: payload.type === 'stock_in' ? 'IN' : 'OUT',
      quantity: payload.quantity,
      description: payload.reason,
      reference: payload.reference,
    })

    return normalizeInventory(data.data)
  }

  async getMovements(): Promise<InventoryMovement[]> {
    try {
      const { data } = await api.get<InventoryMovementApiResponse>('/inventory/transactions')
      return data.data.map(normalizeMovement)
    } catch (error) {
      if (
        error instanceof AxiosError &&
        [400, 404, 405].includes(error.response?.status ?? 0)
      ) {
        const { data } = await api.get<InventoryMovementApiResponse>('/inventory/movements')
        return data.data.map(normalizeMovement)
      }

      throw error
    }
  }
}

export const inventoryService = new InventoryService()
