import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  CheckoutOrderDetail,
  CheckoutOrderItem,
  CheckoutRequest,
  CheckoutResponse,
} from '@/types/checkout'

type CheckoutApiResponse = {
  invoice?: string
}

type OrderListRecord = {
  id?: number
  invoice_number?: string
}

type OrderListEnvelope = {
  data?: {
    items?: OrderListRecord[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
  message?: string
}

type OrderDetailApiRecord = {
  id?: number
  invoice_number?: string
  customer?: string
  total_price?: number
  status?: string
  payment_status?: string
  payment_url?: string
  expires_at?: string
  can_cancel?: boolean
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
    payment_url: toStringValue(record?.payment_url),
    expires_at: toStringValue(record?.expires_at),
    can_cancel: Boolean(record?.can_cancel),
    shipping_address: toStringValue(record?.shipping_address),
    created_at: toStringValue(record?.created_at),
    items,
  }
}

function mapCheckoutResponse(order: CheckoutOrderDetail): CheckoutResponse {
  return {
    order_id: order.id,
    invoice_number: order.invoice_number,
    total: order.total_price,
    status: order.status,
    created_at: order.created_at,
  }
}

class CheckoutService {
  private async resolveOrderIdByInvoice(invoiceNumber: string) {
    const { data } = await api.get<OrderListEnvelope>('/orders', {
      params: {
        page: 1,
        limit: 10,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []
    const matchedOrder = items.find((item) => toStringValue(item.invoice_number) === invoiceNumber)

    if (!matchedOrder?.id) {
      throw new Error('Order berhasil dibuat, tetapi detail order terbaru belum ditemukan.')
    }

    return matchedOrder.id
  }

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
    const invoiceNumber = toStringValue(data.data?.invoice)

    if (!invoiceNumber) {
      throw new Error('Checkout berhasil, tetapi invoice order tidak ditemukan.')
    }

    const orderId = await this.resolveOrderIdByInvoice(invoiceNumber)
    const order = await this.getOrderById(orderId)

    return mapCheckoutResponse(order)
  }
}

export const checkoutService = new CheckoutService()
