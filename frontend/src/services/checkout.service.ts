import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  CheckoutOrderDetail,
  CheckoutOrderItem,
  CheckoutRequest,
  CheckoutResponse,
} from '@/types/checkout'

type CheckoutApiResponse = {
  order_id?: number
  invoice?: string
  total?: number
  status?: string
  payment_status?: string
  payment_method?: string
  payment_url?: string
  created_at?: string
}

type OrderDetailApiRecord = {
  id?: number
  invoice_number?: string
  customer?: string
  total_price?: number
  status?: string
  payment_status?: string
  payment_method?: string
  payment_url?: string
  shipping_address?: string
  created_at?: string
  items?: OrderDetailApiItem[]
}

type OrderDetailApiItem = {
  id?: number
  product?: string
  quantity?: number
  price?: number
  subtotal?: number
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function buildShippingAddress(payload: CheckoutRequest) {
  return [
    payload.shipping_name,
    payload.phone,
    payload.address,
    `${payload.city} ${payload.postal_code}`.trim(),
    payload.notes ? `Catatan: ${payload.notes}` : '',
    `Metode pembayaran: ${payload.payment_method}`,
  ]
    .filter(Boolean)
    .join(', ')
}

function mapOrderItem(item: OrderDetailApiItem, fallbackId: number): CheckoutOrderItem {
  return {
    id: toNumber(item?.id, fallbackId),
    product: toStringValue(item?.product, 'Produk'),
    quantity: toNumber(item?.quantity),
    price: toNumber(item?.price),
    subtotal: toNumber(item?.subtotal),
  }
}

function mapOrderDetail(record?: OrderDetailApiRecord): CheckoutOrderDetail {
  const items = Array.isArray(record?.items)
    ? record.items.map((item, index) => mapOrderItem(item, index + 1))
    : []

  return {
    id: toNumber(record?.id),
    invoice_number: toStringValue(record?.invoice_number),
    customer: toStringValue(record?.customer),
    total_price: toNumber(record?.total_price),
    status: toStringValue(record?.status, 'pending'),
    payment_status: toStringValue(record?.payment_status, 'unpaid'),
    payment_method: toStringValue(record?.payment_method, 'bank_transfer'),
    payment_url: toStringValue(record?.payment_url),
    shipping_address: toStringValue(record?.shipping_address),
    created_at: toStringValue(record?.created_at),
    items,
  }
}

function mapCheckoutResponse(payload: CheckoutApiResponse): CheckoutResponse {
  return {
    order_id: toNumber(payload.order_id),
    invoice_number: toStringValue(payload.invoice),
    total: toNumber(payload.total),
    status: toStringValue(payload.status, 'pending'),
    payment_status: toStringValue(payload.payment_status, 'unpaid'),
    payment_method: toStringValue(payload.payment_method, 'bank_transfer'),
    payment_url: toStringValue(payload.payment_url),
    created_at: toStringValue(payload.created_at),
  }
}

class CheckoutService {
  async getOrderById(id: number | string): Promise<CheckoutOrderDetail> {
    const { data } = await api.get<ApiResponse<OrderDetailApiRecord>>(`/orders/${id}`)
    return mapOrderDetail(data.data)
  }

  async checkout(payload: CheckoutRequest): Promise<CheckoutResponse> {
    const requestBody = {
      ...payload,
      shipping_address: buildShippingAddress(payload),
    }

    const { data } = await api.post<ApiResponse<CheckoutApiResponse>>('/checkout', requestBody)
    const checkoutResult = mapCheckoutResponse(data.data ?? {})

    if (!checkoutResult.invoice_number || !checkoutResult.order_id) {
      throw new Error('Checkout berhasil, tetapi respons order belum lengkap.')
    }

    return checkoutResult
  }
}

export const checkoutService = new CheckoutService()
