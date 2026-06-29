import { AlertTriangle, LogOut } from 'lucide-react'

type LogoutConfirmModalProps = {
  isOpen: boolean
  isSubmitting?: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function LogoutConfirmModal({
  isOpen,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/30"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
            <AlertTriangle className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">Konfirmasi logout</h2>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Anda yakin ingin keluar dari akun ini? Anda perlu login kembali untuk mengakses
              dashboard atau fitur akun.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut className="size-4" />
            <span>{isSubmitting ? 'Memproses...' : 'Ya, keluar'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
