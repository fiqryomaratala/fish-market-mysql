import type { LucideIcon } from 'lucide-react'

type SummaryCardProps = {
  title: string
  value: string
  description: string
  icon: LucideIcon
  tone?: 'cyan' | 'emerald' | 'amber' | 'slate'
}

const toneClasses = {
  cyan: {
    card: 'border-cyan-100 bg-cyan-50/70',
    icon: 'bg-white text-cyan-600',
  },
  emerald: {
    card: 'border-emerald-100 bg-emerald-50/70',
    icon: 'bg-white text-emerald-600',
  },
  amber: {
    card: 'border-amber-100 bg-amber-50/70',
    icon: 'bg-white text-amber-600',
  },
  slate: {
    card: 'border-slate-200 bg-slate-50/80',
    icon: 'bg-white text-slate-600',
  },
} as const

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'cyan',
}: SummaryCardProps) {
  return (
    <article
      className={`rounded-xl border p-5 shadow-lg shadow-slate-200/35 transition hover:-translate-y-0.5 ${toneClasses[tone].card}`}
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
      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  )
}
