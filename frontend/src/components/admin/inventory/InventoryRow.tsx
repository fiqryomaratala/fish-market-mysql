import { Eye, Pencil, RefreshCcw, Trash2 } from 'lucide-react'
import type { Inventory } from '@/types/inventory'
import {
  getInventoryStatusClasses,
  getInventoryStatusLabel,
} from '@/types/inventory'
import { formatDate, formatNumber } from '@/utils/format'

type InventoryRowProps = {
  inventory: Inventory
  canManage?: boolean
  onView: (inventory: Inventory) => void
  onEdit: (inventory: Inventory) => void
  onAdjust: (inventory: Inventory) => void
  onDelete: (inventory: Inventory) => void
}

export function InventoryRow({
  inventory,
  canManage = true,
  onView,
  onEdit,
  onAdjust,
  onDelete,
}: InventoryRowProps) {
  const statusClasses = getInventoryStatusClasses(inventory.status)

  return (
    <>
      <div className="grid gap-4 rounded-xl border border-slate-100 p-4 lg:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900">{inventory.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {inventory.sku} • {inventory.category}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
            {getInventoryStatusLabel(inventory.status)}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stok Saat Ini</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatNumber(inventory.stock)} {inventory.unit}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stok Minimum</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatNumber(inventory.minimum_stock)} {inventory.unit}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Diperbarui</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">
              {formatDate(inventory.updated_at)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Unit</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{inventory.unit}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onView(inventory)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
            Lihat
          </button>
          <button
            type="button"
            onClick={() => onEdit(inventory)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil className="size-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onAdjust(inventory)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="size-4" />
            Sesuaikan
          </button>
          <button
            type="button"
            onClick={() => onDelete(inventory)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="hidden grid-cols-[1fr_1.5fr_1fr_0.8fr_0.9fr_0.9fr_1fr_1fr_180px] items-center gap-4 border-t border-slate-100 px-6 py-4 lg:grid">
        <p className="text-sm font-medium text-slate-700">{inventory.sku}</p>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{inventory.name}</p>
          <p className="mt-1 truncate text-sm text-slate-500">{inventory.category}</p>
        </div>
        <p className="text-sm text-slate-600">{inventory.category}</p>
        <p className="text-sm text-slate-600">{inventory.unit}</p>
        <p className="text-sm font-semibold text-slate-700">{formatNumber(inventory.stock)}</p>
        <p className="text-sm text-slate-600">{formatNumber(inventory.minimum_stock)}</p>
        <span className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
          {getInventoryStatusLabel(inventory.status)}
        </span>
        <p className="text-sm text-slate-600">{formatDate(inventory.updated_at)}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(inventory)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(inventory)}
            disabled={!canManage}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onAdjust(inventory)}
            disabled={!canManage}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(inventory)}
            disabled={!canManage}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}
