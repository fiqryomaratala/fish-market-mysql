import { Activity, Clock3 } from 'lucide-react'
import type { StaffDashboardActivity } from '@/types/staff-dashboard'
import { formatRelativeTime, toTitleCase } from '@/utils/format'

interface RecentActivityTimelineProps {
  items: StaffDashboardActivity[]
}

export function RecentActivityTimeline({ items }: RecentActivityTimelineProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
          Recent Activity
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Timeline aktivitas terbaru</h2>
      </div>

      <div className="mt-6">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="relative rounded-2xl border border-slate-200 bg-slate-50/70 p-4 pl-6">
                <span className="absolute left-0 top-6 h-10 w-1 rounded-full bg-sky-400" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.user}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {toTitleCase(item.action)} pada modul {toTitleCase(item.module)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                    <Clock3 className="size-3.5" />
                    {formatRelativeTime(item.time)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
            <Activity className="mx-auto size-10 text-slate-300" />
            <p className="mt-4 text-sm font-medium text-slate-500">No Data Available</p>
          </div>
        )}
      </div>
    </section>
  )
}
