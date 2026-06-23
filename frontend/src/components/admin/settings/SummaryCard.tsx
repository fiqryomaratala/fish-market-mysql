import type { LucideIcon } from 'lucide-react'

type SummaryCardProps = {
  title: string
  value: string | number
  description: string
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const toneClasses = {
  primary: {
    bg: 'bg-cyan-50',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    text: 'text-cyan-700'
  },
  success: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    text: 'text-emerald-700'
  },
  warning: {
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    text: 'text-amber-700'
  },
  danger: {
    bg: 'bg-rose-50',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    text: 'text-rose-700'
  },
  info: {
    bg: 'bg-slate-50',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    text: 'text-slate-700'
  }
}

export function SummaryCard({ title, value, description, icon: Icon, tone = 'info' }: SummaryCardProps) {
  const classes = toneClasses[tone]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <div className={`rounded-xl ${classes.iconBg} p-3`}>
          <Icon className={`size-6 ${classes.iconColor}`} />
        </div>
      </div>
    </div>
  )
}
