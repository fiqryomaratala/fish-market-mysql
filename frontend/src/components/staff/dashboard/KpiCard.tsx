import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatNumber } from '@/utils/format'

type KpiTone = 'blue' | 'green' | 'orange' | 'purple' | 'red'
type TrendDirection = 'up' | 'down' | 'neutral'

interface KpiCardProps {
  title: string
  value: number
  description: string
  icon: LucideIcon
  tone: KpiTone
  trendLabel: string
  trendDirection?: TrendDirection
}

const toneStyles: Record<KpiTone, string> = {
  blue: 'border-blue-200/70 bg-blue-50/70 text-blue-700',
  green: 'border-emerald-200/70 bg-emerald-50/70 text-emerald-700',
  orange: 'border-amber-200/70 bg-amber-50/80 text-amber-700',
  purple: 'border-violet-200/70 bg-violet-50/80 text-violet-700',
  red: 'border-rose-200/70 bg-rose-50/80 text-rose-700',
}

const trendStyles: Record<KpiTone, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-amber-100 text-amber-700',
  purple: 'bg-violet-100 text-violet-700',
  red: 'bg-rose-100 text-rose-700',
}

const trendIconMap = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
} satisfies Record<TrendDirection, LucideIcon>

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
  trendLabel,
  trendDirection = 'neutral',
}: KpiCardProps) {
  const TrendIcon = trendIconMap[trendDirection]

  return (
    <article className="rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-5 shadow-[0_18px_45px_rgba(148,163,184,0.15)] transition hover:-translate-y-1 hover:shadow-[0_24px_54px_rgba(59,130,246,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {formatNumber(value)}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <div className={`rounded-2xl border p-3 ${toneStyles[tone]}`}>
          <Icon className="size-6" />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${trendStyles[tone]}`}
        >
          <TrendIcon className="size-3.5" />
          {trendLabel}
        </span>
      </div>
    </article>
  )
}
