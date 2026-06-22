import type { OrderStatus } from '@/types/order-management'
import { ORDER_STATUS_COLORS } from '@/types/order-management'

interface OrderStatusBadgeProps {
  status: string
}

const statusColorClasses: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const normalizedStatus = status as OrderStatus
  const color = ORDER_STATUS_COLORS[normalizedStatus] || 'yellow'
  const colorClass = statusColorClasses[color] || statusColorClasses.yellow

  return (
    <span
      className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      {status}
    </span>
  )
}
