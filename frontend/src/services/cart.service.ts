import api from '@/api/axios'
import { FALLBACK_PLACEHOLDER_IMAGE, productService } from '@/services/product.service'
import type { ApiResponse } from '@/types/api'
import type { AddToCartPayload, CartItem, CartSummary, UpdateCartPayload } from '@/types/cart'

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

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

async function enrichCart(data?: CartApiResponse): Promise<CartSummary> {
  const cartItems = Array.isArray(data?.items) ? data.items : []
  const products = await productService.getProducts()
  const productLookup = new Map(products.map((product) => [product.id, product]))

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
    total_price: toNumber(data?.total_price, items.reduce((total, item) => total + item.subtotal, 0)),
  }
}

class CartService {
  async getCart(): Promise<CartSummary> {
    const { data } = await api.get<ApiResponse<CartApiResponse>>('/cart')
    return enrichCart(data.data)
  }

  async addToCart(payload: AddToCartPayload): Promise<CartSummary> {
    const { data } = await api.post<ApiResponse<CartApiResponse>>('/cart', payload)
    return enrichCart(data.data)
  }

  async updateQuantity(id: number, payload: UpdateCartPayload): Promise<CartSummary> {
    const { data } = await api.put<ApiResponse<CartApiResponse>>(`/cart/${id}`, payload)
    return enrichCart(data.data)
  }

  async removeItem(id: number) {
    const { data } = await api.delete<ApiResponse<null>>(`/cart/${id}`)
    return data
  }

  async clearCart() {
    const { data } = await api.delete<ApiResponse<null>>('/cart')
    return data
  }
}

export const cartService = new CartService()
