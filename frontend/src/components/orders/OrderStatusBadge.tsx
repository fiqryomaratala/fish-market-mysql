type OrderStatusBadgeProps = {
  status: string
}

const toneMap: Record<string, string> = {
  Pending: 'border-yellow-200 bg-yellow-50 text-yellow-700',
  Paid: 'border-blue-200 bg-blue-50 text-blue-700',
  Processing: 'border-purple-200 bg-purple-50 text-purple-700',
  Shipping: 'border-orange-200 bg-orange-50 text-orange-700',
  Completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancelled: 'border-red-200 bg-red-50 text-red-700',
}

const labelMap: Record<string, string> = {
  Pending: 'Menunggu',
  Paid: 'Dibayar',
  Processing: 'Diproses',
  Shipping: 'Dikirim',
  Completed: 'Selesai',
  Cancelled: 'Dibatalkan',
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase ${
        toneMap[status] ?? 'border-slate-200 bg-slate-100 text-slate-600'
      }`}
    >
      {labelMap[status] ?? status}
    </span>
  )
}
