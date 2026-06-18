import { AlertCircle, Package2, RefreshCcw } from 'lucide-react'
import { useProduct } from '@/hooks'
import { FALLBACK_PLACEHOLDER_IMAGE } from '@/services/product.service'
import { formatCurrency, formatDate, formatNumber } from '@/utils/format'
import { ProductStatusBadge } from './ProductStatusBadge'

type ProductDetailModalProps = {
  productId?: number | null
  isOpen: boolean
  onClose: () => void
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-700">{value || '-'}</p>
    </div>
  )
}

function DetailStatusItem({ status }: { status: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
      <div className="mt-2">
        <ProductStatusBadge status={status} className="text-sm" />
      </div>
    </div>
  )
}

export function ProductDetailModal({
  productId,
  isOpen,
  onClose,
}: ProductDetailModalProps) {
  const { data, isLoading, error, refetch, isFetching } = useProduct(productId ?? undefined)

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Detail Produk
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {data?.name || 'Ringkasan produk'}
            </h3>
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
          <div className="grid gap-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-red-50 p-4 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-900">Gagal memuat detail produk</h4>
              <p className="mt-2 text-sm text-slate-500">
                {error instanceof Error ? error.message : 'Terjadi kesalahan saat mengambil data.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              <RefreshCcw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
              Coba Lagi
            </button>
          </div>
        ) : null}

        {!isLoading && !error && data ? (
          <div className="grid gap-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              {data.image_url ? (
                <img
                  src={data.image_url}
                  alt={data.name}
                  className="h-72 w-full object-cover"
                />
              ) : (
                <div className="flex h-72 items-center justify-center text-slate-400">
                  <Package2 className="size-12" />
                </div>
              )}
              <div className="border-t border-slate-200 p-4 text-sm text-slate-500">
                {data.image_url || FALLBACK_PLACEHOLDER_IMAGE}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Deskripsi
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {data.description || 'Belum ada deskripsi produk.'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DetailItem label="Harga" value={formatCurrency(data.price)} />
                <DetailItem label="Stok" value={`${formatNumber(data.stock)} pcs`} />
                <DetailItem label="Kategori" value={data.category} />
                <DetailItem label="Berat" value={`${formatNumber(data.weight)} kg`} />
                <DetailStatusItem status={data.status} />
                <DetailItem label="Tanggal Dibuat" value={formatDate(data.created_at)} />
                <DetailItem label="Terakhir Diperbarui" value={formatDate(data.updated_at)} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
