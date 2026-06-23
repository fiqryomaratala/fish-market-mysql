import type { ActivityLog } from '@/types/activity-log'
import { ActivityLogRow } from '@/components/admin/activity-logs/ActivityLogRow'

type ActivityLogTableProps = {
  logs: ActivityLog[]
  onView: (log: ActivityLog) => void
}

export function ActivityLogTable({ logs, onView }: ActivityLogTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Tanggal
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              User
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Role
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Modul
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Aksi
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Deskripsi
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              IP Address
            </th>
            <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <ActivityLogRow key={log.id} log={log} onView={onView} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
