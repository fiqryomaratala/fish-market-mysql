import type { LucideIcon } from 'lucide-react'

type SummaryCardProps = {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  tone?: 'cyan' | 'emerald' | 'amber' | 'slate'
}

const toneClasses: Record<NonNullable<SummaryCardProps['tone']>, string> = {
  cyan: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = 'cyan',
}: SummaryCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40 transition duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <div className={`rounded-xl border p-3 ${toneClasses[tone]}`}>
          <Icon className="size-5" />
        </div>
      </div>
    </article>
  )
}
