import { AlertCircle, CalendarClock, UserRound, Waves } from 'lucide-react'
import { useFeedingLog } from '@/hooks/useFeedingLogs'
import type { FeedingLog } from '@/types/feeding-log'
import { formatDate, formatNumber } from '@/utils/format'

type FeedingLogDetailModalProps = {
  isOpen: boolean
  logId: number | null
  fallbackLog?: FeedingLog | null
  onClose: () => void
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value || '-'}</p>
    </div>
  )
}

function formatDateTime(value: string) {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function FeedingLogDetailModal({
  isOpen,
  logId,
  fallbackLog,
  onClose,
}: FeedingLogDetailModalProps) {
  const feedingLogQuery = useFeedingLog(logId ?? undefined)
  const log = feedingLogQuery.data ?? fallbackLog ?? null

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="scrollbar-hidden max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Detail Log Pakan</p>
          <h3 className="text-2xl font-semibold text-slate-900">Rincian aktivitas pemberian pakan</h3>
          <p className="text-sm text-slate-500">
            Detail diambil dari backend dan diperkaya dengan referensi batch serta inventaris saat tersedia.
          </p>
        </div>

        {feedingLogQuery.isLoading && !log ? (
          <div className="mt-5 animate-pulse space-y-4">
            <div className="h-24 rounded-xl bg-slate-100" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-20 rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        ) : null}

        {!feedingLogQuery.isLoading && feedingLogQuery.isError && !log ? (
          <section className="mt-5 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 py-12 text-center">
            <div className="rounded-full bg-white p-4 text-red-600">
              <AlertCircle className="size-7" />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-900">Gagal memuat detail log pakan</h4>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Detail log tidak bisa dimuat saat ini. Silakan tutup modal lalu coba lagi dari tabel.
            </p>
          </section>
        ) : null}

        {log ? (
          <>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-cyan-700">
                  <Waves className="size-5" />
                  <p className="text-sm font-semibold text-slate-900">{log.pond_name || '-'}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">Kolam asal batch {log.batch_code || '-'}</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-cyan-700">
                  <CalendarClock className="size-5" />
                  <p className="text-sm font-semibold text-slate-900">{formatDateTime(log.feeding_time)}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">Waktu pemberian pakan yang tercatat</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3 text-cyan-700">
                  <UserRound className="size-5" />
                  <p className="text-sm font-semibold text-slate-900">{log.created_by || '-'}</p>
                </div>
                <p className="mt-2 text-sm text-slate-500">Pembuat data sesuai respons backend</p>
              </article>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <DetailItem label="Kode Batch" value={log.batch_code || '-'} />
              <DetailItem label="Jenis Ikan" value={log.fish_type || '-'} />
              <DetailItem label="Kolam" value={log.pond_name || '-'} />
              <DetailItem label="Nama Pakan" value={log.feed_name || '-'} />
              <DetailItem label="Jenis Pakan" value={log.feed_type || '-'} />
              <DetailItem label="Jumlah" value={`${formatNumber(log.quantity)} kg`} />
              <DetailItem label="Waktu Pakan" value={formatDateTime(log.feeding_time)} />
              <DetailItem label="Catatan" value={log.notes || '-'} />
              <DetailItem label="Dibuat Oleh" value={log.created_by || '-'} />
              <DetailItem label="Dibuat Pada" value={log.created_at ? formatDateTime(log.created_at) : '-'} />
              <DetailItem label="Diperbarui Pada" value={log.updated_at ? formatDateTime(log.updated_at) : '-'} />
              <DetailItem label="Tanggal Log" value={formatDate(log.feeding_time)} />
            </div>
          </>
        ) : null}

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
