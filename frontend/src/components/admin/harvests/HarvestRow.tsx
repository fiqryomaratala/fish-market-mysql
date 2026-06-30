import type { ReactNode } from 'react'
import { ArrowRightLeft, Eye, Pencil, Trash2 } from 'lucide-react'
import type { Harvest } from '@/types/harvest'
import { getHarvestStatusClasses, getHarvestStatusDot } from '@/types/harvest'
import { formatDate, formatNumber } from '@/utils/format'

type HarvestRowProps = {
  harvest: Harvest
  canManage?: boolean
  canDelete?: boolean
  onView: (harvest: Harvest) => void
  onEdit: (harvest: Harvest) => void
  onTransfer: (harvest: Harvest) => void
  onDelete: (harvest: Harvest) => void
}

export function HarvestRow({
  harvest,
  canManage = true,
  canDelete = true,
  onView,
  onEdit,
  onTransfer,
  onDelete,
}: HarvestRowProps) {
  return (
    <>
      <div className="grid gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 lg:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">{harvest.harvest_code}</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{harvest.fish_type}</p>
            <p className="mt-1 text-sm text-slate-500">{harvest.batch_code}</p>
          </div>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getHarvestStatusClasses(harvest.status)}`}>
            <span className={`size-2 rounded-full ${getHarvestStatusDot(harvest.status)}`} />
            {harvest.status}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Kolam</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{harvest.pond_name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Tanggal Panen</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatDate(harvest.harvest_date)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(harvest.total_quantity)} ekor</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Total Bobot</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{formatNumber(harvest.total_weight)} kg</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton label="Lihat detail" tone="slate" onClick={() => onView(harvest)}>
            <Eye className="size-4" />
          </ActionButton>
          <ActionButton label="Edit data" tone="emerald" onClick={() => onEdit(harvest)} disabled={!canManage}>
            <Pencil className="size-4" />
          </ActionButton>
          <ActionButton
            label="Transfer panen"
            tone="amber"
            onClick={() => onTransfer(harvest)}
            disabled={!canManage || harvest.status === 'Transferred To Inventory'}
          >
            <ArrowRightLeft className="size-4" />
          </ActionButton>
          <ActionButton label="Hapus data" tone="red" onClick={() => onDelete(harvest)} disabled={!canDelete}>
            <Trash2 className="size-4" />
          </ActionButton>
        </div>
      </div>

      <div className="hidden grid-cols-[1fr_1.15fr_0.95fr_0.85fr_0.95fr_0.8fr_0.9fr_1.05fr_190px] items-center gap-4 border-t border-slate-100 px-6 py-4 lg:grid">
        <p className="text-sm font-semibold text-slate-900">{harvest.harvest_code}</p>
        <p className="text-sm text-slate-700">{harvest.batch_code}</p>
        <p className="text-sm text-slate-700">{harvest.fish_type}</p>
        <p className="text-sm text-slate-700">{harvest.pond_name}</p>
        <p className="text-sm text-slate-700">{formatDate(harvest.harvest_date)}</p>
        <p className="whitespace-nowrap text-sm text-slate-700">{formatNumber(harvest.total_quantity)} ekor</p>
        <p className="whitespace-nowrap text-sm text-slate-700">{formatNumber(harvest.total_weight)} kg</p>
        <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getHarvestStatusClasses(harvest.status)}`}>
          <span className={`size-2 rounded-full ${getHarvestStatusDot(harvest.status)}`} />
          {harvest.status}
        </span>
        <div className="flex items-center gap-2">
          <ActionButton label="Lihat detail" tone="slate" onClick={() => onView(harvest)}>
            <Eye className="size-4" />
          </ActionButton>
          <ActionButton label="Edit data" tone="emerald" onClick={() => onEdit(harvest)} disabled={!canManage}>
            <Pencil className="size-4" />
          </ActionButton>
          <ActionButton
            label="Transfer panen"
            tone="amber"
            onClick={() => onTransfer(harvest)}
            disabled={!canManage || harvest.status === 'Transferred To Inventory'}
          >
            <ArrowRightLeft className="size-4" />
          </ActionButton>
          <ActionButton label="Hapus data" tone="red" onClick={() => onDelete(harvest)} disabled={!canDelete}>
            <Trash2 className="size-4" />
          </ActionButton>
        </div>
      </div>
    </>
  )
}

function ActionButton({
  label,
  tone,
  onClick,
  disabled,
  children,
}: {
  label: string
  tone: 'slate' | 'emerald' | 'amber' | 'red'
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  const toneClasses = {
    slate: 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700',
    emerald: 'border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700',
    amber: 'border-amber-300 text-amber-600 hover:bg-amber-50 hover:text-amber-700',
    red: 'border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600',
  }

  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex size-10 items-center justify-center rounded-xl border bg-white transition disabled:cursor-not-allowed disabled:opacity-45 ${toneClasses[tone]}`}
    >
      {children}
    </button>
  )
}
