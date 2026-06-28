import type { Pond } from '@/types/pond'
import { PondRow } from './PondRow'

type PondTableProps = {
  ponds: Pond[]
  canManage?: boolean
  onView: (pond: Pond) => void
  onEdit: (pond: Pond) => void
  onDelete: (pond: Pond) => void
}

export function PondTable({ ponds, canManage = true, onView, onEdit, onDelete }: PondTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-[110px_1.2fr_1.2fr_1.1fr_0.9fr_1fr_0.9fr_1fr_140px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>Code</span>
        <span>Name</span>
        <span>Location</span>
        <span>Dimensions</span>
        <span>Capacity</span>
        <span>Water Source</span>
        <span>Status</span>
        <span>Updated</span>
        <span>Action</span>
      </div>

      <div className="space-y-3 p-4 lg:space-y-0 lg:p-0">
        {ponds.map((pond) => (
          <PondRow
            key={pond.id}
            pond={pond}
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
