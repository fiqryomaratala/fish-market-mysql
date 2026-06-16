import type { ActivityLogItem } from '@/types/dashboard'
import { formatRelativeTime } from '@/utils/format'

type RecentActivityProps = {
  items: ActivityLogItem[]
}

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('')
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <section className="rounded-xl border border-white/60 bg-white/75 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
          Recent Activity
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Aktivitas Terbaru</h2>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={item.id} className="flex gap-4 rounded-xl bg-slate-50/90 p-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-emerald-500 text-sm font-semibold text-white">
              {getInitials(item.user || 'SY')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                <span className="shrink-0 text-xs text-slate-500">
                  {formatRelativeTime(item.created_at)}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                {item.user} • {item.module}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
