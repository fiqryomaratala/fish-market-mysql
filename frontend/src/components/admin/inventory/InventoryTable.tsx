import type { Inventory } from '@/types/inventory'
import { InventoryRow } from './InventoryRow'

type InventoryTableProps = {
  inventories: Inventory[]
  canManage?: boolean
  canAdjust?: boolean
  adjustLabel?: string
  onView: (inventory: Inventory) => void
  onEdit: (inventory: Inventory) => void
  onAdjust: (inventory: Inventory) => void
  onDelete: (inventory: Inventory) => void
}

export function InventoryTable({
  inventories,
  canManage = true,
  canAdjust = true,
  adjustLabel = 'Sesuaikan',
  onView,
  onEdit,
  onAdjust,
  onDelete,
}: InventoryTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
      <div className="hidden grid-cols-[1fr_1.5fr_1fr_0.8fr_0.9fr_0.9fr_1fr_1fr_180px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>SKU</span>
        <span>Nama</span>
        <span>Kategori</span>
        <span>Unit</span>
        <span>Stok Saat Ini</span>
        <span>Stok Minimum</span>
        <span>Status</span>
        <span>Diperbarui</span>
        <span>Aksi</span>
      </div>

      <div className="space-y-3 p-4 lg:space-y-0 lg:p-0">
        {inventories.map((inventory) => (
          <InventoryRow
            key={inventory.id}
            inventory={inventory}
            canManage={canManage}
            canAdjust={canAdjust}
            adjustLabel={adjustLabel}
            onView={onView}
            onEdit={onEdit}
            onAdjust={onAdjust}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
