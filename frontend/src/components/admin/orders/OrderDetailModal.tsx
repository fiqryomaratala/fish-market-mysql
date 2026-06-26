import { X, Package, Phone, Mail, MapPin, CreditCard, Calendar } from 'lucide-react'
import { OrderStatusBadge } from './OrderStatusBadge'
import { OrderTimeline } from './OrderTimeline'
import { formatCompactCurrency } from '@/utils/format'
import { useOrder } from '@/hooks/useOrderManagement'

interface OrderDetailModalProps {
  orderId: number | null
  onClose: () => void
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const { data: order, isLoading } = useOrder(orderId!)

  if (!orderId) return null

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="size-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) return null

  const formattedDate = formatDateTime(order.created_at)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="scrollbar-hidden max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">Detail Pesanan</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <Package className="size-5" />
                <span className="font-semibold">Informasi Pesanan</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-600">Invoice Number</p>
                  <p className="font-semibold text-slate-900">
                    {order.invoice_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Status</p>
                  <div className="mt-1">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Tanggal Dibuat</p>
                  <p className="flex items-center gap-1 text-sm text-slate-900">
                    <Calendar className="size-4" />
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <Mail className="size-5" />
                <span className="font-semibold">Informasi Pelanggan</span>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-600">Nama</p>
                  <p className="font-semibold text-slate-900">{order.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Email</p>
                  <p className="text-sm text-slate-900">{order.customer_email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Telepon</p>
                  <p className="flex items-center gap-1 text-sm text-slate-900">
                    <Phone className="size-4" />
                    {order.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <MapPin className="size-5" />
                <span className="font-semibold">Alamat Pengiriman</span>
              </div>
              <p className="text-sm text-slate-900">{order.shipping_address}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-2 text-slate-700">
                <CreditCard className="size-5" />
                <span className="font-semibold">Metode Pembayaran</span>
              </div>
              <p className="text-sm font-medium text-slate-900">
                {order.payment_method}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Timeline Status</h3>
            <OrderTimeline currentStatus={order.status} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Item Pesanan</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                      Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                      Batch Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                      Jenis Ikan
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-700">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                      Harga
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-200">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900">
                          {item.product_name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700">{item.batch_code}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-700">{item.fish_type}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-900">
                          {formatCompactCurrency(item.price)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900">
                          {formatCompactCurrency(item.subtotal)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Item</p>
                <p className="text-2xl font-bold text-slate-900">
                  {order.total_items} Item
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">Total Harga</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCompactCurrency(order.total_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
