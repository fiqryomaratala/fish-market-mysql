type GrowthProgressCardProps = {
  title: string
  value: string
  description: string
  progress?: number
  tone?: 'cyan' | 'emerald' | 'orange' | 'slate'
}

const progressToneClasses: Record<NonNullable<GrowthProgressCardProps['tone']>, string> = {
  cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500',
  orange: 'bg-orange-500',
  slate: 'bg-slate-500',
}

export function GrowthProgressCard({
  title,
  value,
  description,
  progress,
  tone = 'cyan',
}: GrowthProgressCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      {typeof progress === 'number' ? (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all ${progressToneClasses[tone]}`}
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {Math.round(progress)}% progress
          </p>
        </div>
      ) : null}
    </article>
  )
}
