import { getPaymentStatusLabel, getPaymentStatusTone } from '@/types/checkout'

type PaymentStatusBadgeProps = {
  status: string
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.08em] ${getPaymentStatusTone(status)}`}
    >
      {getPaymentStatusLabel(status)}
    </span>
  )
}
