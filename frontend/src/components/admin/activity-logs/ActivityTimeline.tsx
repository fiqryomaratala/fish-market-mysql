import { Eye } from 'lucide-react'
import type { ActivityLog } from '@/types/activity-log'
import {
  formatActivityDateTime,
  formatActivityTime,
  getActionLabel,
  getModuleLabel,
} from '@/pages/admin/activity-logs/activity-log.utils'

type ActivityTimelineProps = {
  logs: ActivityLog[]
  onView: (log: ActivityLog) => void
}

export function ActivityTimeline({ logs, onView }: ActivityTimelineProps) {
  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <article
          key={log.id}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="flex size-11 items-center justify-center rounded-xl bg-cyan-50 text-sm font-semibold text-cyan-700">
                  {formatActivityTime(log.created_at)}
                </span>
                <span className="mt-3 h-full w-px bg-slate-200" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-slate-900">{log.user_name || 'Sistem'}</p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {getActionLabel(log.action)}
                  </span>
                  <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700">
                    {getModuleLabel(log.module)}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{log.description || '-'}</p>
                <p className="text-xs text-slate-400">{formatActivityDateTime(log.created_at)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onView(log)}
              className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
            >
              <Eye className="size-4" />
              View Detail
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
