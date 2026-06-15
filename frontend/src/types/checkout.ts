import { z } from 'zod'

export const CHECKOUT_SHIPPING_FEE = 25000

export const paymentMethodOptions = [
  {
    value: 'bank_transfer',
    label: 'Bank Transfer',
    description: 'Transfer manual ke rekening tujuan setelah order dibuat.',
  },
  {
    value: 'e_wallet',
    label: 'E-Wallet',
    description: 'Pembayaran digital cepat untuk konfirmasi yang lebih praktis.',
  },
  {
    value: 'cod',
    label: 'Cash On Delivery',
    description: 'Bayar saat pesanan diterima sesuai area pengiriman yang tersedia.',
  },
] as const

export interface CheckoutRequest {
  shipping_name: string
  phone: string
  address: string
  city: string
  postal_code: string
  notes: string
  payment_method: string
}

export interface CheckoutResponse {
  order_id: number
  invoice_number: string
  total: number
  status: string
  created_at: string
}

export interface CheckoutOrderItem {
  id: number
  product: string
  quantity: number
  price: number
  subtotal: number
}

export interface CheckoutOrderDetail {
  id: number
  invoice_number: string
  customer: string
  total_price: number
  status: string
  payment_status: string
  shipping_address: string
  created_at: string
  items: CheckoutOrderItem[]
}

export const checkoutSchema = z.object({
  shipping_name: z.string().trim().min(1, 'Nama penerima wajib diisi.'),
  phone: z.string().trim().min(1, 'Nomor telepon wajib diisi.'),
  address: z.string().trim().min(1, 'Alamat wajib diisi.'),
  city: z.string().trim().min(1, 'Kota wajib diisi.'),
  postal_code: z.string().trim().min(1, 'Kode pos wajib diisi.'),
  notes: z.string().trim(),
  payment_method: z.string().trim().min(1, 'Metode pembayaran wajib dipilih.'),
})

export type CheckoutFormValues = z.infer<typeof checkoutSchema>
