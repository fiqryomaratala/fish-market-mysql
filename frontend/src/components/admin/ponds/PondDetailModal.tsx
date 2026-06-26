import { AlertCircle, Droplets, Gauge, Ruler, Waves } from 'lucide-react'
import { usePond } from '@/hooks'
import { getPondStatusClasses, getPondStatusDot } from '@/types/pond'
import { formatDate, formatNumber } from '@/utils/format'

type PondDetailModalProps = {
  isOpen: boolean
  pondId?: number | null
  onClose: () => void
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function getVolume(length: number, width: number, depth: number) {
  return length * width * depth
}

export function PondDetailModal({ isOpen, pondId, onClose }: PondDetailModalProps) {
  const { data, isLoading, error, refetch, isFetching } = usePond(pondId ?? undefined)

  if (!isOpen) {
    return null
  }

  const pond = data
  const volume = pond ? getVolume(pond.length, pond.width, pond.depth) : 0
  const capacityRatio = volume > 0 ? Math.min(100, Math.round((pond!.capacity / volume) * 100)) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="scrollbar-hidden max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Detail Kolam</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {pond?.name ?? 'Memuat data kolam'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {pond?.code ? `${pond.code} • ${pond.location}` : 'Informasi lengkap kolam dari backend'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Tutup
          </button>
        </div>

        {isLoading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        ) : error || !pond ? (
          <div className="mt-6 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 text-center">
            <div className="rounded-full bg-red-100 p-4 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-900">Gagal memuat detail kolam</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Terjadi kendala saat mengambil detail kolam dari backend.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              {isFetching ? 'Memuat...' : 'Retry'}
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Informasi Kolam
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">{pond.code}</p>
                    <p className="mt-1 text-sm text-slate-500">{pond.location}</p>
                  </div>
                  <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
                    <Waves className="size-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Dimensi {formatNumber(pond.length)} x {formatNumber(pond.width)} x {formatNumber(pond.depth)}.
                </p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Utilisasi Kapasitas
                    </p>
                    <p className="mt-3 text-lg font-semibold text-slate-900">
                      {formatNumber(pond.capacity)}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Rasio kapasitas terhadap volume berdasarkan dimensi kolam
                    </p>
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-amber-700">
                    <Gauge className="size-5" />
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${capacityRatio}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Volume estimasi {formatNumber(volume)} dengan rasio {formatNumber(capacityRatio)}%
                </p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
                    <span
                      className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getPondStatusClasses(pond.status)}`}
                    >
                      <span className={`size-2 rounded-full ${getPondStatusDot(pond.status)}`} />
                      {pond.status}
                    </span>
                    <p className="mt-3 text-sm text-slate-500">{pond.water_source}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-700">
                    <Droplets className="size-5" />
                  </div>
                </div>
              </article>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailField label="Kode" value={pond.code} />
              <DetailField label="Nama" value={pond.name} />
              <DetailField label="Lokasi" value={pond.location} />
              <DetailField
                label="Dimensi"
                value={`${formatNumber(pond.length)} x ${formatNumber(pond.width)} x ${formatNumber(pond.depth)}`}
              />
              <DetailField label="Kapasitas" value={formatNumber(pond.capacity)} />
              <DetailField label="Sumber Air" value={pond.water_source} />
              <DetailField label="Status" value={pond.status} />
              <DetailField label="Dibuat Pada" value={formatDate(pond.created_at)} />
              <DetailField label="Diperbarui Pada" value={formatDate(pond.updated_at)} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600">
                  <Ruler className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ringkasan dimensi kolam</p>
                  <p className="text-sm text-slate-500">
                    Panjang {formatNumber(pond.length)}, lebar {formatNumber(pond.width)}, kedalaman{' '}
                    {formatNumber(pond.depth)}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
