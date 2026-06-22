import { ArrowRightLeft } from 'lucide-react'
import type { Harvest } from '@/types/harvest'

type TransferModalProps = {
  isOpen: boolean
  harvest?: Harvest | null
  isSubmitting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function TransferModal({
  isOpen,
  harvest,
  isSubmitting,
  onClose,
  onConfirm,
}: TransferModalProps) {
  if (!isOpen || !harvest) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex items-start gap-4">
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-purple-700">
            <ArrowRightLeft className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Transfer ke inventory?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Data panen <span className="font-semibold text-slate-700">{harvest.harvest_code}</span> akan
              diproses ke inventory jika endpoint backend tersedia.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Jika backend belum mendukung endpoint transfer, sistem akan menampilkan pesan gagal dari API.
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Memproses...' : 'Transfer'}
          </button>
        </div>
      </div>
    </div>
  )
}

