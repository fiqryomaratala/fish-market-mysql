import { useMemo, useState } from 'react'
import { Eye, EyeOff, Loader2, LockKeyhole, ShieldAlert, X } from 'lucide-react'
import { useChangePassword } from '@/hooks/use-settings'

type ChangePasswordModalProps = {
  isOpen: boolean
  onClose: () => void
}

type PasswordRequirementProps = {
  met: boolean
  text: string
}

function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`size-2 rounded-full ${met ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <span className={`text-xs ${met ? 'text-emerald-600' : 'text-slate-500'}`}>{text}</span>
    </div>
  )
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const changePasswordMutation = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setErrorMessage('')
  }

  const requirements = useMemo(
    () => ({
      minLength: newPassword.length >= 8,
      hasLetter: /[A-Za-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
      hasSymbol: /[^A-Za-z0-9]/.test(newPassword),
      matches: newPassword.length > 0 && newPassword === confirmPassword,
      differentFromCurrent: newPassword.length > 0 && newPassword !== currentPassword,
    }),
    [confirmPassword, currentPassword, newPassword],
  )

  const canSubmit =
    currentPassword.trim().length > 0 &&
    requirements.minLength &&
    requirements.hasLetter &&
    requirements.hasNumber &&
    requirements.hasSymbol &&
    requirements.matches &&
    requirements.differentFromCurrent

  const handleClose = () => {
    if (changePasswordMutation.isPending) {
      return
    }

    resetForm()
    onClose()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!canSubmit) {
      setErrorMessage('Pastikan semua syarat password baru sudah terpenuhi.')
      return
    }

    try {
      await changePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      })

      resetForm()
      onClose()
    } catch {
      setErrorMessage('Gagal mengubah password. Silakan periksa kembali data Anda.')
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-300/40">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              Keamanan Akun
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">Ubah Password</h3>
            <p className="mt-2 text-sm text-slate-500">
              Gunakan password yang kuat agar akun admin tetap aman.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            aria-label="Tutup modal"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password Saat Ini
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label="Tampilkan password saat ini"
                >
                  {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password Baru
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label="Tampilkan password baru"
                >
                  {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  aria-label="Tampilkan konfirmasi password baru"
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Syarat Password</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <PasswordRequirement met={requirements.minLength} text="Minimal 8 karakter" />
              <PasswordRequirement met={requirements.hasLetter} text="Mengandung huruf" />
              <PasswordRequirement met={requirements.hasNumber} text="Mengandung angka" />
              <PasswordRequirement met={requirements.hasSymbol} text="Mengandung simbol" />
              <PasswordRequirement
                met={requirements.differentFromCurrent}
                text="Berbeda dari password saat ini"
              />
              <PasswordRequirement
                met={requirements.matches}
                text="Konfirmasi password harus sama"
              />
            </div>
          </div>

          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Perhatian</p>
                <ul className="mt-2 space-y-1 text-xs text-amber-700">
                  <li>Password baru harus berbeda dari password sebelumnya.</li>
                  <li>Simpan password baru di tempat yang aman.</li>
                  <li>Anda mungkin perlu login ulang setelah perubahan berhasil.</li>
                </ul>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={changePasswordMutation.isPending}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending || !canSubmit}
              className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {changePasswordMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Mengubah...
                </span>
              ) : (
                'Simpan Password Baru'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
