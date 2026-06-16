import { PackageSearch } from 'lucide-react'

type EmptyStateProps = {
  onStartShopping: () => void
}

export function EmptyState({ onStartShopping }: EmptyStateProps) {
  return (
    <div className="order-card flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <PackageSearch className="size-12" />
      </div>
      <h3 className="text-2xl font-semibold text-slate-900">Pesanan tidak ditemukan.</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
        Pesanan Anda belum terlihat di hasil ini. Coba ubah filter atau lanjut belanja dulu.
      </p>
      <button
        type="button"
        onClick={onStartShopping}
        className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-emerald-600"
      >
        Mulai Belanja
      </button>
    </div>
  )
}
