import type { FeedingLog } from '@/types/feeding-log'
import { FeedingLogRow } from './FeedingLogRow'

type FeedingLogTableProps = {
  logs: FeedingLog[]
  canManage?: boolean
  canDelete?: boolean
  onView: (log: FeedingLog) => void
  onEdit: (log: FeedingLog) => void
  onDelete: (log: FeedingLog) => void
}

export function FeedingLogTable({
  logs,
  canManage = true,
  canDelete = true,
  onView,
  onEdit,
  onDelete,
}: FeedingLogTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-[130px_1fr_1fr_1fr_1fr_110px_160px_120px_120px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>Date</span>
        <span>Batch Code</span>
        <span>Fish Type</span>
        <span>Pond</span>
        <span>Feed Name</span>
        <span>Quantity</span>
        <span>Feeding Time</span>
        <span>Created By</span>
        <span>Action</span>
      </div>

      <div className="space-y-3 p-4 lg:space-y-0 lg:p-0">
        {logs.map((log) => (
          <FeedingLogRow
            key={log.id}
            log={log}
            canManage={canManage}
            canDelete={canDelete}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
