import api from '@/api/axios'
import { FALLBACK_PLACEHOLDER_IMAGE, productService } from '@/services/product.service'
import type { ApiResponse } from '@/types/api'
import type { AddToCartPayload, CartItem, CartSummary, UpdateCartPayload } from '@/types/cart'

const GUEST_CART_STORAGE_KEY = 'fish_market_guest_cart'

type CartApiItem = {
  id?: number
  quantity?: number
  subtotal?: number
  product?: {
    id?: number
    name?: string
    price?: number
  }
}

type CartApiResponse = {
  items?: CartApiItem[]
  total_price?: number
}

type GuestCartRecord = {
  product_id: number
  quantity: number
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function readGuestCartRecords(): GuestCartRecord[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(GUEST_CART_STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    const parsed = JSON.parse(storedValue)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((item) => ({
        product_id: toNumber(item?.product_id),
        quantity: toNumber(item?.quantity),
      }))
      .filter((item) => item.product_id > 0 && item.quantity > 0)
  } catch {
    return []
  }
}

function writeGuestCartRecords(records: GuestCartRecord[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(records))
}

function clearGuestCartRecords() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(GUEST_CART_STORAGE_KEY)
}

async function buildSummaryFromProducts(records: GuestCartRecord[]): Promise<CartSummary> {
  const products = await productService.getProducts({ page: 1, limit: 1000 })
  const productLookup = new Map(products.items.map((product) => [product.id, product]))

  const items: CartItem[] = records
    .map((record, index) => {
      const product = productLookup.get(record.product_id)

      if (!product) {
        return null
      }

      const quantity = Math.min(record.quantity, Math.max(product.stock, 0))
      const subtotal = product.price * quantity

      return {
        id: index + 1,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        stock: product.stock,
        image_url: product.image_url || FALLBACK_PLACEHOLDER_IMAGE,
        subtotal,
        batch_code: product.batch_code || '-',
        farm_name: product.farm_name || '-',
      }
    })
    .filter((item): item is CartItem => item !== null && item.quantity > 0)

  const sanitizedRecords = items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
  }))

  writeGuestCartRecords(sanitizedRecords)

  return {
    items,
    total_items: items.reduce((total, item) => total + item.quantity, 0),
    total_price: items.reduce((total, item) => total + item.subtotal, 0),
  }
}

async function enrichApiCart(data?: CartApiResponse): Promise<CartSummary> {
  const cartItems = Array.isArray(data?.items) ? data.items : []
  const products = await productService.getProducts({ page: 1, limit: 1000 })
  const productLookup = new Map(products.items.map((product) => [product.id, product]))

  const items: CartItem[] = cartItems.map((item, index) => {
    const productId = toNumber(item.product?.id)
    const catalogProduct = productLookup.get(productId)
    const quantity = toNumber(item.quantity)
    const price = toNumber(item.product?.price, catalogProduct?.price ?? 0)
    const subtotal = toNumber(item.subtotal, price * quantity)

    return {
      id: toNumber(item.id, index + 1),
      product_id: productId,
      name: toStringValue(item.product?.name, catalogProduct?.name ?? 'Produk'),
      price,
      quantity,
      stock: catalogProduct?.stock ?? 0,
      image_url: catalogProduct?.image_url || FALLBACK_PLACEHOLDER_IMAGE,
      subtotal,
      batch_code: catalogProduct?.batch_code ?? '-',
      farm_name: catalogProduct?.farm_name ?? '-',
    }
  })

  return {
    items,
    total_items: items.reduce((total, item) => total + item.quantity, 0),
    total_price: toNumber(
      data?.total_price,
      items.reduce((total, item) => total + item.subtotal, 0),
    ),
  }
}

class CartService {
  async getCart(): Promise<CartSummary> {
    const { data } = await api.get<ApiResponse<CartApiResponse>>('/cart')
    return enrichApiCart(data.data)
  }

  async addToCart(payload: AddToCartPayload): Promise<CartSummary> {
    const { data } = await api.post<ApiResponse<CartApiResponse>>('/cart', payload)
    return enrichApiCart(data.data)
  }

  async updateQuantity(id: number, payload: UpdateCartPayload): Promise<CartSummary> {
    const { data } = await api.put<ApiResponse<CartApiResponse>>(`/cart/${id}`, payload)
    return enrichApiCart(data.data)
  }

  async removeItem(id: number) {
    const { data } = await api.delete<ApiResponse<null>>(`/cart/${id}`)
    return data
  }

  async clearCart() {
    const { data } = await api.delete<ApiResponse<null>>('/cart')
    return data
  }

  async getGuestCart(): Promise<CartSummary> {
    return buildSummaryFromProducts(readGuestCartRecords())
  }

  async addGuestToCart(payload: AddToCartPayload): Promise<CartSummary> {
    const records = readGuestCartRecords()
    const existingItem = records.find((item) => item.product_id === payload.product_id)

    if (existingItem) {
      existingItem.quantity += payload.quantity
    } else {
      records.push({
        product_id: payload.product_id,
        quantity: payload.quantity,
      })
    }

    return buildSummaryFromProducts(records)
  }

  async updateGuestQuantity(productId: number, payload: UpdateCartPayload): Promise<CartSummary> {
    const records = readGuestCartRecords().map((item) =>
      item.product_id === productId ? { ...item, quantity: payload.quantity } : item,
    )

    return buildSummaryFromProducts(records)
  }

  async removeGuestItem(productId: number): Promise<CartSummary> {
    const records = readGuestCartRecords().filter((item) => item.product_id !== productId)
    return buildSummaryFromProducts(records)
  }

  async clearGuestCart(): Promise<CartSummary> {
    clearGuestCartRecords()

    return {
      items: [],
      total_items: 0,
      total_price: 0,
    }
  }

  async syncGuestCartToServer() {
    const records = readGuestCartRecords()

    if (records.length === 0) {
      return
    }

    for (const record of records) {
      await this.addToCart({
        product_id: record.product_id,
        quantity: record.quantity,
      })
    }

    clearGuestCartRecords()
  }
}

export const cartService = new CartService()
