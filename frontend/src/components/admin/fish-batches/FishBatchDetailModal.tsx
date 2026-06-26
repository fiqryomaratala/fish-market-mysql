import { AlertCircle, CalendarClock, Fish, Timer, Waves } from 'lucide-react'
import { useFishBatch } from '@/hooks'
import {
  calculateDaysRemaining,
  calculateGrowthProgress,
  calculateSurvivalRate,
  getFishBatchStatusClasses,
  getFishBatchStatusDot,
  getFishBatchStatusLabel,
} from '@/types/fish-batch'
import { formatDate, formatNumber } from '@/utils/format'
import { GrowthProgressCard } from './GrowthProgressCard'

type FishBatchDetailModalProps = {
  isOpen: boolean
  batchId?: number | null
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

export function FishBatchDetailModal({ isOpen, batchId, onClose }: FishBatchDetailModalProps) {
  const { data, isLoading, error, refetch, isFetching } = useFishBatch(batchId ?? undefined)

  if (!isOpen) {
    return null
  }

  const batch = data
  const survivalRate = batch ? calculateSurvivalRate(batch) : 0
  const growthProgress = batch ? calculateGrowthProgress(batch) : 0
  const daysRemaining = batch ? calculateDaysRemaining(batch.estimated_harvest_date) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="scrollbar-hidden max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Detail Batch Ikan</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {batch?.batch_code ?? 'Memuat data batch ikan'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {batch ? `${batch.fish_type} • ${batch.pond_name}` : 'Informasi lengkap batch ikan dari backend'}
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
              <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : error || !batch ? (
          <div className="mt-6 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 text-center">
            <div className="rounded-full bg-red-100 p-4 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-900">Gagal memuat detail batch ikan</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Terjadi kendala saat mengambil detail batch ikan dari backend.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              {isFetching ? 'Memuat...' : 'Coba Lagi'}
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
                    <p className="mt-3 text-lg font-semibold text-slate-900">{batch.pond_name}</p>
                    <p className="mt-1 text-sm text-slate-500">{batch.fish_type}</p>
                  </div>
                  <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
                    <Waves className="size-5" />
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Batch code {batch.batch_code} dengan total awal {formatNumber(batch.initial_quantity)} ekor.
                </p>
              </article>

              <GrowthProgressCard
                title="Penggunaan Kapasitas"
                value={`${formatNumber(batch.current_quantity)} ekor`}
                description={`Sisa hidup sekitar ${survivalRate.toFixed(1)}% dari jumlah awal.`}
                progress={survivalRate}
                tone="emerald"
              />

              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
                    <span
                      className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getFishBatchStatusClasses(batch.status)}`}
                    >
                      <span className={`size-2 rounded-full ${getFishBatchStatusDot(batch.status)}`} />
                      {getFishBatchStatusLabel(batch.status)}
                    </span>
                    <p className="mt-3 text-sm text-slate-500">
                      Bobot rata-rata {formatNumber(batch.average_weight)} kg
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-blue-700">
                    <Fish className="size-5" />
                  </div>
                </div>
              </article>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <GrowthProgressCard
                title="Tingkat Kelangsungan Hidup"
                value={`${survivalRate.toFixed(1)}%`}
                description="Perbandingan jumlah ikan saat ini terhadap jumlah awal."
                progress={survivalRate}
                tone="emerald"
              />
              <GrowthProgressCard
                title="Progress Pertumbuhan"
                value={`${Math.round(growthProgress)}%`}
                description="Progress visual berdasarkan rentang tanggal tebar sampai target panen."
                progress={growthProgress}
                tone="cyan"
              />
              <GrowthProgressCard
                title="Sisa Hari Menuju Panen"
                value={
                  daysRemaining === null
                    ? '-'
                    : daysRemaining >= 0
                      ? `${daysRemaining} hari`
                      : `${Math.abs(daysRemaining)} hari lewat`
                }
                description="Menghitung selisih tanggal estimasi panen dengan hari ini."
                tone={daysRemaining !== null && daysRemaining < 0 ? 'orange' : 'slate'}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailField label="Kode Batch" value={batch.batch_code} />
              <DetailField label="Jenis Ikan" value={batch.fish_type} />
              <DetailField label="Kolam" value={batch.pond_name} />
              <DetailField label="Jumlah Awal" value={formatNumber(batch.initial_quantity)} />
              <DetailField label="Jumlah Saat Ini" value={formatNumber(batch.current_quantity)} />
              <DetailField label="Bobot Rata-rata" value={`${formatNumber(batch.average_weight)} kg`} />
              <DetailField label="Tanggal Tebar" value={formatDate(batch.stocking_date)} />
              <DetailField label="Estimasi Tanggal Panen" value={formatDate(batch.estimated_harvest_date)} />
              <DetailField label="Status" value={getFishBatchStatusLabel(batch.status)} />
              <DetailField label="Catatan" value={batch.notes || '-'} />
              <DetailField label="Dibuat Pada" value={formatDate(batch.created_at)} />
              <DetailField label="Diperbarui Pada" value={formatDate(batch.updated_at)} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600">
                    <CalendarClock className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Jadwal budidaya</p>
                    <p className="text-sm text-slate-500">
                      Tebar {formatDate(batch.stocking_date)} dan target panen {formatDate(batch.estimated_harvest_date)}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600">
                    <Timer className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Monitoring batch</p>
                    <p className="text-sm text-slate-500">
                      Gunakan detail ini untuk memantau survival rate dan kesiapan panen batch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
