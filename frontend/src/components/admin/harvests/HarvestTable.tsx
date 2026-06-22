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
      <div className="hidden grid-cols-[130px_130px_1fr_1fr_140px_120px_140px_140px_140px_180px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>Kode Panen</span>
        <span>Kode Batch</span>
        <span>Jenis Ikan</span>
        <span>Kolam</span>
        <span>Tanggal Panen</span>
        <span>Quantity</span>
        <span>Total Bobot</span>
        <span>Survival Rate</span>
        <span>Status</span>
        <span>Aksi</span>
      </div>

      <div className="space-y-3 p-4 lg:space-y-0 lg:p-0">
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
  )
}
