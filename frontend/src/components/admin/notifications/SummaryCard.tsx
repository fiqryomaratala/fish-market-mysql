import type { LucideIcon } from 'lucide-react'

type SummaryCardProps = {
  title: string
  value: number
  description: string
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'warning' | 'slate'
}

const toneClasses = {
  primary: {
    card: 'border-cyan-100 bg-cyan-50/80',
    icon: 'bg-cyan-600 text-white',
  },
  success: {
    card: 'border-emerald-100 bg-emerald-50/80',
    icon: 'bg-emerald-600 text-white',
  },
  warning: {
    card: 'border-amber-100 bg-amber-50/80',
    icon: 'bg-amber-500 text-white',
  },
  slate: {
    card: 'border-slate-200 bg-slate-50/80',
    icon: 'bg-slate-600 text-white',
  },
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'primary',
}: SummaryCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 shadow-lg shadow-slate-200/40 transition duration-200 hover:-translate-y-0.5 ${toneClasses[tone].card}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <span className={`rounded-xl p-3 shadow-sm ${toneClasses[tone].icon}`}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-4 text-sm text-slate-500">{description}</p>
    </article>
  )
}
