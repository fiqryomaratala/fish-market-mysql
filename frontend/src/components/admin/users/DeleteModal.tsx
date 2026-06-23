import { AlertTriangle, X } from 'lucide-react'

interface DeleteModalProps {
  isOpen: boolean
  userName: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

function DeleteModal({ isOpen, userName, isDeleting, onClose, onConfirm }: DeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <AlertTriangle className="size-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Hapus User</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-600">
          User <span className="font-semibold text-slate-900">{userName}</span> akan dihapus dari sistem. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus User'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
