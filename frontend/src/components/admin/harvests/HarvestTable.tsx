import type { Harvest } from '@/types/harvest'
import { HarvestRow } from './HarvestRow'

type HarvestTableProps = {
  harvests: Harvest[]
  canManage?: boolean
  canDelete?: boolean
  onView: (harvest: Harvest) => void
  onEdit: (harvest: Harvest) => void
  onTransfer: (harvest: Harvest) => void
  onDelete: (harvest: Harvest) => void
}

export function HarvestTable({
  harvests,
  canManage = true,
  canDelete = true,
  onView,
  onEdit,
  onTransfer,
  onDelete,
}: HarvestTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
      <div className="p-4 lg:hidden">
        <div className="space-y-3">
          {harvests.map((harvest) => (
            <HarvestRow
              key={harvest.id}
              harvest={harvest}
              canManage={canManage}
              canDelete={canDelete}
              onView={onView}
              onEdit={onEdit}
              onTransfer={onTransfer}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="scrollbar-soft overflow-x-auto">
          <div className="min-w-[1320px]">
            <div className="grid grid-cols-[140px_160px_150px_140px_140px_130px_140px_140px_170px_180px] gap-4 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>Harvest Code</span>
              <span>Batch Code</span>
              <span>Fish Type</span>
              <span>Pond</span>
              <span>Harvest Date</span>
              <span>Quantity</span>
              <span>Total Weight</span>
              <span>Survival Rate</span>
              <span>Status</span>
              <span>Action</span>
            </div>

            <div>
              {harvests.map((harvest) => (
                <HarvestRow
                  key={harvest.id}
                  harvest={harvest}
                  canManage={canManage}
                  canDelete={canDelete}
                  onView={onView}
                  onEdit={onEdit}
                  onTransfer={onTransfer}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 px-6 py-3">
          <p className="text-xs text-slate-400">
            Geser ke samping untuk melihat seluruh kolom tabel.
          </p>
        </div>
      </div>
    </div>
  )
}
