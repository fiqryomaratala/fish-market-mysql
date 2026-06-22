import type { ReactNode } from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import type { FeedingLog } from '@/types/feeding-log'
import { getFeedingSession, getFeedingSessionClasses } from '@/types/feeding-log'
import { formatDate, formatNumber } from '@/utils/format'

type FeedingLogRowProps = {
  log: FeedingLog
  canManage?: boolean
  canDelete?: boolean
  onView: (log: FeedingLog) => void
  onEdit: (log: FeedingLog) => void
  onDelete: (log: FeedingLog) => void
}

function formatTime(value: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function ActionButton({
  label,
  onClick,
  tone,
  children,
}: {
  label: string
  onClick: () => void
  tone: 'slate' | 'cyan' | 'red'
  children: ReactNode
}) {
  const toneClasses =
    tone === 'cyan'
      ? 'border-cyan-200 text-cyan-700 hover:bg-cyan-50'
      : tone === 'red'
        ? 'border-red-200 text-red-600 hover:bg-red-50'
        : 'border-slate-200 text-slate-700 hover:bg-slate-50'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-xl border p-2 transition ${toneClasses}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export function FeedingLogRow({
  log,
  canManage = true,
  canDelete = true,
  onView,
  onEdit,
  onDelete,
}: FeedingLogRowProps) {
  const session = getFeedingSession(log.feeding_time)

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md lg:grid lg:grid-cols-[130px_1fr_1fr_1fr_1fr_110px_160px_120px_120px] lg:items-center lg:gap-4 lg:rounded-none lg:border-0 lg:border-b lg:px-6 lg:py-4 lg:last:border-b-0">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Tanggal</p>
        <p className="text-sm font-semibold text-slate-900">{formatDate(log.feeding_time)}</p>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Batch Code</p>
        <p className="text-sm font-semibold text-slate-900">{log.batch_code || '-'}</p>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Fish Type</p>
        <p className="text-sm text-slate-700">{log.fish_type || '-'}</p>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Pond</p>
        <p className="text-sm text-slate-700">{log.pond_name || '-'}</p>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Feed Name</p>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-slate-700">{log.feed_name || '-'}</p>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getFeedingSessionClasses(session)}`}
          >
            {session}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Quantity</p>
        <p className="text-sm font-semibold text-slate-900">{formatNumber(log.quantity)} kg</p>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Feeding Time</p>
        <p className="text-sm text-slate-700">{formatTime(log.feeding_time)}</p>
      </div>

      <div className="mt-4 space-y-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:hidden">Created By</p>
        <p className="text-sm text-slate-700">{log.created_by || '-'}</p>
      </div>

      <div className="mt-4 flex items-center gap-2 lg:mt-0 lg:justify-end">
        <ActionButton label="Lihat detail" onClick={() => onView(log)} tone="slate">
          <Eye className="size-4" />
        </ActionButton>
        {canManage ? (
          <ActionButton label="Edit log" onClick={() => onEdit(log)} tone="cyan">
            <Pencil className="size-4" />
          </ActionButton>
        ) : null}
        {canDelete ? (
          <ActionButton label="Hapus log" onClick={() => onDelete(log)} tone="red">
            <Trash2 className="size-4" />
          </ActionButton>
        ) : null}
      </div>
    </article>
  )
}
