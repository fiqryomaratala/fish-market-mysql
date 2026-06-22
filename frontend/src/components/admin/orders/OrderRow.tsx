import { Eye, Package } from 'lucide-react'
import type { OrderListItem } from '@/types/order-management'
import { OrderStatusBadge } from './OrderStatusBadge'
import { formatCompactCurrency } from '@/utils/format'

interface OrderRowProps {
  order: OrderListItem
  onViewDetail: (order: OrderListItem) => void
  onUpdateStatus: (order: OrderListItem) => void
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function OrderRow({
  order,
  onViewDetail,
  onUpdateStatus,
}: OrderRowProps) {
  const formattedDate = formatDate(order.created_at)

  return (
    <tr className="border-b border-slate-200 transition hover:bg-slate-50">
      <td className="px-4 py-4">
        <p className="font-semibold text-slate-900">{order.invoice_number}</p>
      </td>
      <td className="px-4 py-4">
        <div>
          <p className="font-medium text-slate-900">{order.customer_name}</p>
          <p className="text-xs text-slate-500">{order.customer_email}</p>
        </div>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-700">
          <Package className="size-4" />
          {order.total_items}
        </span>
      </td>
      <td className="px-4 py-4">
        <p className="font-semibold text-slate-900">
          {formatCompactCurrency(order.total_amount)}
        </p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-700">{order.payment_method}</p>
      </td>
      <td className="px-4 py-4">
        <OrderStatusBadge status={order.status} />
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{formattedDate}</p>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetail(order)}
            className="rounded-lg bg-blue-500 p-2 text-white transition hover:bg-blue-600"
            title="Lihat Detail"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onUpdateStatus(order)}
            className="rounded-lg bg-purple-500 p-2 text-white transition hover:bg-purple-600"
            title="Update Status"
          >
            <Package className="size-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
