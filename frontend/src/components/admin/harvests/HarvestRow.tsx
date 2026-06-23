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

function ActionButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  )
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
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/40 lg:rounded-none lg:border-0 lg:border-t lg:border-slate-100 lg:p-0 lg:hover:shadow-none">
      <div className="grid gap-4 lg:grid-cols-[140px_160px_150px_140px_140px_130px_140px_140px_170px_180px] lg:px-6 lg:py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Kode Panen</p>
          <p className="text-sm font-semibold text-slate-900">{harvest.harvest_code}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Kode Batch</p>
          <p className="text-sm text-slate-700">{harvest.batch_code}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Jenis Ikan</p>
          <p className="text-sm text-slate-700">{harvest.fish_type}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Kolam</p>
          <p className="text-sm text-slate-700">{harvest.pond_name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Tanggal Panen</p>
          <p className="text-sm text-slate-700">{formatDate(harvest.harvest_date)}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Quantity</p>
          <p className="whitespace-nowrap text-sm text-slate-700">
            {formatNumber(harvest.total_quantity)} ekor
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Total Bobot</p>
          <p className="whitespace-nowrap text-sm text-slate-700">{formatNumber(harvest.total_weight)} kg</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Survival Rate</p>
          <p className="whitespace-nowrap text-sm text-slate-700">{harvest.survival_rate.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Status</p>
          <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${getHarvestStatusClasses(harvest.status)}`}
          >
            <span className={`size-2 rounded-full ${getHarvestStatusDot(harvest.status)}`} />
            {harvest.status}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Aksi</p>
          <div className="flex flex-nowrap gap-2">
            <ActionButton label="Lihat" onClick={() => onView(harvest)}>
              <Eye className="size-4" />
            </ActionButton>
            <ActionButton label="Edit" onClick={() => onEdit(harvest)} disabled={!canManage}>
              <Pencil className="size-4" />
            </ActionButton>
            <ActionButton
              label="Transfer"
              onClick={() => onTransfer(harvest)}
              disabled={!canManage || harvest.status === 'Transferred To Inventory'}
            >
              <ArrowRightLeft className="size-4" />
            </ActionButton>
            <ActionButton label="Hapus" onClick={() => onDelete(harvest)} disabled={!canDelete}>
              <Trash2 className="size-4" />
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  )
}
