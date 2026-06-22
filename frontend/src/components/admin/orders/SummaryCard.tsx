import type { LucideIcon } from 'lucide-react'

interface SummaryCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  colorClass?: string
}

export function SummaryCard({
  title,
  value,
  icon: Icon,
  colorClass = 'bg-blue-500',
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl ${colorClass} p-4`}>
          <Icon className="size-6 text-white" />
        </div>
      </div>
    </div>
  )
}
