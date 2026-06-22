import type { LucideIcon } from 'lucide-react'

type SummaryCardProps = {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  tone?: 'cyan' | 'emerald' | 'amber' | 'purple'
}

const toneClasses: Record<NonNullable<SummaryCardProps['tone']>, string> = {
  cyan: 'border-cyan-100 bg-cyan-50 text-cyan-700',
  emerald: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-100 bg-amber-50 text-amber-700',
  purple: 'border-purple-100 bg-purple-50 text-purple-700',
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'cyan',
}: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 transition duration-200 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        <div className={`rounded-xl border p-3 ${toneClasses[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  )
}

