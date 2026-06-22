import { AlertCircle } from 'lucide-react'
import { useHarvest } from '@/hooks'
import { useFishBatches } from '@/hooks/useFishBatches'
import { getHarvestStatusClasses, getHarvestStatusDot } from '@/types/harvest'
import { formatDate, formatNumber } from '@/utils/format'

type HarvestDetailModalProps = {
  isOpen: boolean
  harvestId?: number | null
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

export function HarvestDetailModal({ isOpen, harvestId, onClose }: HarvestDetailModalProps) {
  const { data, isLoading, error, refetch, isFetching } = useHarvest(harvestId ?? undefined)
  const fishBatchesQuery = useFishBatches({ page: 1, limit: 1000 })

  if (!isOpen) {
    return null
  }

  const batch = fishBatchesQuery.data?.items.find((item) => item.id === data?.fish_batch_id)
  const harvest = data
    ? {
        ...data,
        pond_name: data.pond_name !== '-' ? data.pond_name : batch?.pond_name ?? '-',
        survival_rate:
          data.survival_rate > 0
            ? data.survival_rate
            : batch && batch.initial_quantity > 0
              ? Math.max(0, Math.min(100, (data.total_quantity / batch.initial_quantity) * 100))
              : 0,
      }
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">Detail Panen</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {harvest?.harvest_code ?? 'Memuat data panen'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {harvest ? `${harvest.batch_code} • ${harvest.fish_type}` : 'Informasi lengkap panen dari backend'}
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
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
            ))}
          </div>
        ) : error || !harvest ? (
          <div className="mt-6 flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 text-center">
            <div className="rounded-full bg-red-100 p-4 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-900">Gagal memuat detail panen</h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Terjadi kendala saat mengambil detail panen dari backend.
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
              <DetailField label="Kode Panen" value={harvest.harvest_code} />
              <DetailField label="Kode Batch" value={harvest.batch_code} />
              <DetailField label="Jenis Ikan" value={harvest.fish_type} />
              <DetailField label="Kolam" value={harvest.pond_name} />
              <DetailField label="Tanggal Panen" value={formatDate(harvest.harvest_date)} />
              <DetailField label="Total Quantity" value={`${formatNumber(harvest.total_quantity)} ekor`} />
              <DetailField label="Bobot Rata-rata" value={`${formatNumber(harvest.average_weight)} kg`} />
              <DetailField label="Total Bobot" value={`${formatNumber(harvest.total_weight)} kg`} />
              <DetailField label="Survival Rate" value={`${harvest.survival_rate.toFixed(1)}%`} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
              <span
                className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${getHarvestStatusClasses(harvest.status)}`}
              >
                <span className={`size-2 rounded-full ${getHarvestStatusDot(harvest.status)}`} />
                {harvest.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailField label="Notes" value={harvest.notes || '-'} />
              <DetailField label="Dibuat Oleh" value={harvest.created_by || '-'} />
              <DetailField label="Dibuat Pada" value={formatDate(harvest.created_at)} />
              <DetailField label="Diperbarui Pada" value={formatDate(harvest.updated_at)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
