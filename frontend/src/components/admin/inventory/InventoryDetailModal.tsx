import { RefreshCcw, X } from 'lucide-react'
import { useInventory } from '@/hooks/useInventory'
import {
  getInventoryStatusClasses,
  getInventoryStatusLabel,
} from '@/types/inventory'
import { formatDate, formatNumber } from '@/utils/format'

type InventoryDetailModalProps = {
  isOpen: boolean
  inventoryId?: number | null
  onClose: () => void
}

export function InventoryDetailModal({
  isOpen,
  inventoryId,
  onClose,
}: InventoryDetailModalProps) {
  const { data, isLoading, error, refetch, isFetching } = useInventory(inventoryId ?? undefined)

  if (!isOpen) {
    return null
  }

  const inventory = data

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-300/40">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              Detail Inventaris
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {inventory?.name ?? 'Memuat data inventaris'}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4 px-6 py-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : error || !inventory ? (
          <div className="px-6 py-10 text-center">
            <h4 className="text-lg font-semibold text-slate-900">Gagal memuat detail inventaris</h4>
            <p className="mt-2 text-sm text-slate-500">
              Data detail tidak tersedia saat ini. Silakan coba muat ulang.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              <RefreshCcw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
              Muat Ulang
            </button>
          </div>
        ) : (
          <div className="space-y-5 px-6 py-6">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getInventoryStatusClasses(inventory.status)}`}
              >
                {getInventoryStatusLabel(inventory.status)}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {inventory.category}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <DetailField label="Nama" value={inventory.name} />
              <DetailField label="SKU" value={inventory.sku} />
              <DetailField label="Kategori" value={inventory.category} />
              <DetailField
                label="Stok Saat Ini"
                value={`${formatNumber(inventory.stock)} ${inventory.unit}`}
              />
              <DetailField
                label="Stok Minimum"
                value={`${formatNumber(inventory.minimum_stock)} ${inventory.unit}`}
              />
              <DetailField label="Status" value={getInventoryStatusLabel(inventory.status)} />
              <DetailField label="Dibuat" value={formatDate(inventory.created_at)} />
              <DetailField label="Diperbarui" value={formatDate(inventory.updated_at)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

type DetailFieldProps = {
  label: string
  value: string
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value || '-'}</p>
    </div>
  )
}
