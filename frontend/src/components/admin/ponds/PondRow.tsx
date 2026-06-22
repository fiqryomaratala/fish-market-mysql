import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { Pond } from '@/types/pond'
import { getPondStatusClasses, getPondStatusDot } from '@/types/pond'
import { formatDate, formatNumber } from '@/utils/format'

type PondRowProps = {
  pond: Pond
  canManage?: boolean
  onView: (pond: Pond) => void
  onEdit: (pond: Pond) => void
  onDelete: (pond: Pond) => void
}

function formatDimensions(pond: Pond) {
  return `${formatNumber(pond.length)} x ${formatNumber(pond.width)} x ${formatNumber(pond.depth)}`
}

export function PondRow({ pond, canManage = true, onView, onEdit, onDelete }: PondRowProps) {
  const statusClasses = getPondStatusClasses(pond.status)
  const statusDot = getPondStatusDot(pond.status)

  return (
    <>
      <div className="grid gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-cyan-100 hover:bg-slate-50/70 lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">{pond.code}</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{pond.name}</p>
            <p className="mt-1 text-sm text-slate-500">{pond.location}</p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
            <span className={`size-2 rounded-full ${statusDot}`} />
            {pond.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Dimensi</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatDimensions(pond)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Kapasitas</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(pond.capacity)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sumber Air</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{pond.water_source}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Diperbarui</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(pond.updated_at)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onView(pond)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
            Lihat
          </button>
          <button
            type="button"
            onClick={() => onEdit(pond)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil className="size-4" />
            Ubah
          </button>
          <button
            type="button"
            onClick={() => onDelete(pond)}
            disabled={!canManage}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            Hapus
          </button>
        </div>
      </div>

      <div className="hidden grid-cols-[110px_1.2fr_1.2fr_1.1fr_0.9fr_1fr_0.9fr_1fr_140px] items-center gap-4 border-t border-slate-100 px-6 py-4 lg:grid">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-600">{pond.code}</p>
        <p className="text-sm font-semibold text-slate-900">{pond.name}</p>
        <p className="text-sm text-slate-600">{pond.location}</p>
        <p className="text-sm text-slate-600">{formatDimensions(pond)}</p>
        <p className="text-sm font-medium text-slate-700">{formatNumber(pond.capacity)}</p>
        <p className="text-sm text-slate-600">{pond.water_source}</p>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusClasses}`}>
          <span className={`size-2 rounded-full ${statusDot}`} />
          {pond.status}
        </span>
        <p className="text-sm text-slate-600">{formatDate(pond.updated_at)}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(pond)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(pond)}
            disabled={!canManage}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(pond)}
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
