import type { LucideIcon } from 'lucide-react'
import { formatCompactCurrency, formatNumber } from '@/utils/format'

type DashboardCardProps = {
  title: string
  value: number
  icon: LucideIcon
  tone: 'blue' | 'emerald' | 'cyan' | 'teal'
  prefix?: 'currency' | 'number'
}

const toneMap = {
  blue: {
    badge: 'from-blue-500/20 via-cyan-400/15 to-sky-400/20 text-blue-700',
    icon: 'bg-blue-600 text-white',
    ring: 'hover:border-blue-200',
  },
  emerald: {
    badge: 'from-emerald-500/20 via-teal-400/15 to-cyan-400/20 text-emerald-700',
    icon: 'bg-emerald-600 text-white',
    ring: 'hover:border-emerald-200',
  },
  cyan: {
    badge: 'from-cyan-500/20 via-sky-400/15 to-blue-400/20 text-cyan-700',
    icon: 'bg-cyan-600 text-white',
    ring: 'hover:border-cyan-200',
  },
  teal: {
    badge: 'from-teal-500/20 via-emerald-400/15 to-cyan-400/20 text-teal-700',
    icon: 'bg-teal-600 text-white',
    ring: 'hover:border-teal-200',
  },
} as const

export function DashboardCard({
  title,
  value,
  icon: Icon,
  tone,
  prefix = 'number',
}: DashboardCardProps) {
  const palette = toneMap[tone]

  return (
    <article
      className={`admin-dashboard-panel group rounded-xl border border-white/60 bg-white/70 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1 ${palette.ring}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`inline-flex rounded-full bg-linear-to-r px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${palette.badge}`}
          >
            {title}
          </span>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            {prefix === 'currency' ? formatCompactCurrency(value) : formatNumber(value)}
          </p>
        </div>

        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${palette.icon} transition duration-300 group-hover:scale-105`}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </article>
  )
}
