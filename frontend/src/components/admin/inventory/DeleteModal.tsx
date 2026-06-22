import { AlertTriangle } from 'lucide-react'

type DeleteModalProps = {
  isOpen: boolean
  title?: string
  description: string
  isDeleting?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteModal({
  isOpen,
  title = 'Yakin ingin menghapus data inventaris?',
  description,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-red-50 p-3 text-red-600">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>
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
            disabled={isDeleting}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}
