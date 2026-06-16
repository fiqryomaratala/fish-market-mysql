import { AlertCircle } from 'lucide-react'

type ErrorStateProps = {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="order-card flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-red-200 bg-white px-6 py-12 text-center">
      <div className="mb-5 rounded-full bg-red-50 p-4 text-red-500">
        <AlertCircle className="size-9" />
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">Gagal memuat pesanan.</h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
        Terjadi masalah saat mengambil histori pesanan dari server.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
      >
        Coba Lagi
      </button>
    </div>
  )
}
