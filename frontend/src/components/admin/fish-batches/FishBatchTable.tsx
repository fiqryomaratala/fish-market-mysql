import type { FishBatch } from '@/types/fish-batch'
import { FishBatchRow } from './FishBatchRow'

type FishBatchTableProps = {
  batches: FishBatch[]
  canManage?: boolean
  onView: (batch: FishBatch) => void
  onEdit: (batch: FishBatch) => void
  onDelete: (batch: FishBatch) => void
}

export function FishBatchTable({
  batches,
  canManage = true,
  onView,
  onEdit,
  onDelete,
}: FishBatchTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-[140px_1fr_1fr_0.9fr_0.9fr_0.9fr_1fr_1fr_0.9fr_120px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>Batch Code</span>
        <span>Fish Type</span>
        <span>Pond</span>
        <span>Initial Quantity</span>
        <span>Current Quantity</span>
        <span>Average Weight</span>
        <span>Stocking Date</span>
        <span>Harvest Date</span>
        <span>Status</span>
        <span>Action</span>
      </div>

      <div className="space-y-3 p-4 lg:space-y-0 lg:p-0">
        {batches.map((batch) => (
          <FishBatchRow
            key={batch.id}
            batch={batch}
            canManage={canManage}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
