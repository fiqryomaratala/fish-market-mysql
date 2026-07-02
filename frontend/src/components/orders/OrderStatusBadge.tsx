import { getOrderStatusLabel, getOrderStatusTone } from '@/types/checkout'

type OrderStatusBadgeProps = {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.08em] ${getOrderStatusTone(status)}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  )
}
