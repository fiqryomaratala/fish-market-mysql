import { AlertCircle, Clock3, MapPin, Shield, User, Workflow, X } from 'lucide-react'
import { useActivityLog } from '@/hooks/useActivityLogs'
import type { ActivityLog } from '@/types/activity-log'
import {
  formatActivityDateTime,
  getActionLabel,
  getModuleLabel,
  getRoleLabel,
} from '@/pages/admin/activity-logs/activity-log.utils'

type ActivityDetailModalProps = {
  logId: number | null
  fallbackLog: ActivityLog | null
  onClose: () => void
}

function DetailItem({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon: typeof User
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-600">
        <Icon className="size-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="text-sm font-medium leading-6 text-slate-900">{value || '-'}</p>
    </div>
  )
}

export function ActivityDetailModal({
  logId,
  fallbackLog,
  onClose,
}: ActivityDetailModalProps) {
  const detailQuery = useActivityLog(logId)
  const log = detailQuery.data ?? fallbackLog

  if (!logId) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="scrollbar-hidden max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Audit Trail
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Detail Aktivitas</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {detailQuery.isLoading && !log ? (
          <div className="p-8">
            <div className="space-y-4">
              <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {detailQuery.isError && !log ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-10 text-center">
            <div className="rounded-full bg-red-50 p-4 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Detail aktivitas gagal dimuat</h3>
            <button
              type="button"
              onClick={() => void detailQuery.refetch()}
              className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Retry
            </button>
          </div>
        ) : null}

        {log ? (
          <div className="space-y-6 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label="User Name" value={log.user_name || 'Sistem'} icon={User} />
              <DetailItem label="Role" value={getRoleLabel(log.user_role)} icon={Shield} />
              <DetailItem label="Module" value={getModuleLabel(log.module)} icon={Workflow} />
              <DetailItem label="Action" value={getActionLabel(log.action)} icon={Clock3} />
              <DetailItem label="IP Address" value={log.ip_address || '-'} icon={MapPin} />
              <DetailItem
                label="Created At"
                value={formatActivityDateTime(log.created_at)}
                icon={Clock3}
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Description
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{log.description || '-'}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
