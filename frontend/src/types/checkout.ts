import { z } from 'zod'

export const CHECKOUT_SHIPPING_FEE = 25000

export const paymentMethodOptions = [
  {
    value: 'bank_transfer',
    label: 'Xendit Payment Link',
    description: 'Bayar online lewat halaman checkout Xendit dengan pilihan metode pembayaran yang tersedia.',
  },
  {
    value: 'e_wallet',
    label: 'Xendit E-Wallet / VA',
    description: 'Cocok untuk pembayaran digital melalui e-wallet atau virtual account dari halaman Xendit.',
  },
  {
    value: 'cod',
    label: 'Bayar di Tempat (COD)',
    description: 'Bayar saat pesanan diterima sesuai area pengiriman yang tersedia.',
  },
] as const

export function getPaymentMethodLabel(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'bank_transfer') {
    return 'Xendit Payment Link'
  }

  if (normalized === 'e_wallet') {
    return 'Xendit E-Wallet / VA'
  }

  if (normalized === 'cod') {
    return 'Bayar di Tempat (COD)'
  }

  return value
}

export function getPaymentStatusLabel(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'paid') {
    return 'Sudah dibayar'
  }

  if (normalized === 'unpaid') {
    return 'Menunggu pembayaran'
  }

  return value
}

export function getPaymentStatusDescription(value: string, paymentMethod: string) {
  const normalizedStatus = value.trim().toLowerCase()
  const normalizedMethod = paymentMethod.trim().toLowerCase()

  if (normalizedStatus === 'paid') {
    return 'Pembayaran Anda sudah kami terima dan pesanan sedang diproses.'
  }

  if (normalizedMethod === 'cod') {
    return 'Pembayaran akan dilakukan saat pesanan diterima di lokasi tujuan.'
  }

  if (normalizedMethod === 'bank_transfer' || normalizedMethod === 'e_wallet') {
    return 'Selesaikan pembayaran melalui halaman Xendit agar pesanan bisa segera kami proses.'
  }

  return 'Status pembayaran akan diperbarui setelah proses pembayaran selesai.'
}

export function getPaymentStatusTone(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'paid') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (normalized === 'unpaid') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-slate-200 bg-slate-100 text-slate-600'
}

export function getOrderStatusLabel(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'pending') {
    return 'Menunggu diproses'
  }

  if (normalized === 'processing') {
    return 'Sedang diproses'
  }

  if (normalized === 'shipping') {
    return 'Sedang dikirim'
  }

  if (normalized === 'completed') {
    return 'Selesai'
  }

  if (normalized === 'cancelled') {
    return 'Dibatalkan'
  }

  return value
}

export function getOrderStatusTone(value: string) {
  const normalized = value.trim().toLowerCase()

  if (normalized === 'pending') {
    return 'border-yellow-200 bg-yellow-50 text-yellow-700'
  }

  if (normalized === 'processing') {
    return 'border-purple-200 bg-purple-50 text-purple-700'
  }

  if (normalized === 'shipping') {
    return 'border-orange-200 bg-orange-50 text-orange-700'
  }

  if (normalized === 'completed') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (normalized === 'cancelled') {
    return 'border-red-200 bg-red-50 text-red-700'
  }

  return 'border-slate-200 bg-slate-100 text-slate-600'
}

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
  payment_status: string
  payment_method: string
  payment_url?: string
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
  payment_method: string
  payment_url?: string
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
