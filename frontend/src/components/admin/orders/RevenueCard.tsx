import { DollarSign } from 'lucide-react'
import { formatCompactCurrency } from '@/utils/format'

interface RevenueCardProps {
  label: string
  amount: number
  colorClass?: string
}

export function RevenueCard({
  label,
  amount,
  colorClass = 'bg-green-500',
}: RevenueCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {formatCompactCurrency(amount)}
          </p>
        </div>
        <div className={`rounded-xl ${colorClass} p-4`}>
          <DollarSign className="size-6 text-white" />
        </div>
      </div>
    </div>
  )
}
