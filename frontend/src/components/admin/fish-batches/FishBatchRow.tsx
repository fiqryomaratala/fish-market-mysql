import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { FishBatch } from '@/types/fish-batch'
import { getFishBatchStatusClasses, getFishBatchStatusDot } from '@/types/fish-batch'
import { formatDate, formatNumber } from '@/utils/format'

type FishBatchRowProps = {
  batch: FishBatch
  canManage?: boolean
  onView: (batch: FishBatch) => void
  onEdit: (batch: FishBatch) => void
  onDelete: (batch: FishBatch) => void
}

export function FishBatchRow({
  batch,
  canManage = true,
  onView,
  onEdit,
  onDelete,
}: FishBatchRowProps) {
  const statusClasses = getFishBatchStatusClasses(batch.status)
  const statusDot = getFishBatchStatusDot(batch.status)

  return (
    <>
      <div className="grid gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-cyan-100 hover:bg-slate-50/70 lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              {batch.batch_code}
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">{batch.fish_type}</p>
            <p className="mt-1 text-sm text-slate-500">{batch.pond_name}</p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
            <span className={`size-2 rounded-full ${statusDot}`} />
            {batch.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Jumlah Awal</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(batch.initial_quantity)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Jumlah Saat Ini</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(batch.current_quantity)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bobot Rata-rata</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(batch.average_weight)} kg</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal Tebar</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(batch.stocking_date)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal Panen</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(batch.estimated_harvest_date)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onView(batch)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
            Lihat
          </button>
          <button
            type="button"
            onClick={() => onEdit(batch)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil className="size-4" />
            Ubah
          </button>
          <button
            type="button"
            onClick={() => onDelete(batch)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="hidden grid-cols-[140px_1fr_1fr_0.9fr_0.9fr_0.9fr_1fr_1fr_0.9fr_120px] items-center gap-4 border-t border-slate-100 px-6 py-4 lg:grid">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">{batch.batch_code}</p>
        <p className="text-sm font-semibold text-slate-900">{batch.fish_type}</p>
        <p className="text-sm text-slate-600">{batch.pond_name}</p>
        <p className="text-sm font-medium text-slate-700">{formatNumber(batch.initial_quantity)}</p>
        <p className="text-sm font-medium text-slate-700">{formatNumber(batch.current_quantity)}</p>
        <p className="text-sm text-slate-600">{formatNumber(batch.average_weight)} kg</p>
        <p className="text-sm text-slate-600">{formatDate(batch.stocking_date)}</p>
        <p className="text-sm text-slate-600">{formatDate(batch.estimated_harvest_date)}</p>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
          <span className={`size-2 rounded-full ${statusDot}`} />
          {batch.status}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(batch)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(batch)}
            disabled={!canManage}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(batch)}
            disabled={!canManage}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}
