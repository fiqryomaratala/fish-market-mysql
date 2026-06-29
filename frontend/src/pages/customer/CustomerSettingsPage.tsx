import { KeyRound, RefreshCcw, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ChangePasswordModal } from '@/components/customer/profile/ChangePasswordModal'
import { useChangePassword, usePageTitle, useProfile } from '@/hooks'
import type { ChangePasswordPayload } from '@/types/profile'

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (typeof response?.data?.message === 'string' && response.data.message) {
      return response.data.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Terjadi kesalahan. Silakan coba lagi.'
}

function CustomerSettingsPage() {
  usePageTitle('Pengaturan Pelanggan')

  const profileQuery = useProfile()
  const changePasswordMutation = useChangePassword()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    try {
      await changePasswordMutation.mutateAsync(payload)
      setIsPasswordModalOpen(false)
      toast.success('Password berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (profileQuery.isLoading) {
    return <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-rose-200 bg-white px-6 py-12 text-center shadow-sm">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Gagal memuat pengaturan</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Data pengaturan pelanggan belum bisa diambil dari backend. Coba ulangi beberapa saat lagi.
        </p>
        <button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Coba Lagi
        </button>
      </section>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
                Pengaturan Akun
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Keamanan pelanggan</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
                Semua pengaturan keamanan akun pelanggan dipusatkan di halaman ini agar profil tetap
                fokus pada data identitas dan alamat.
              </p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
              Masuk sebagai <span className="font-semibold">{profileQuery.data.name}</span>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
              Keamanan
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Ubah kata sandi</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Perbarui kata sandi secara berkala untuk menjaga keamanan akun pelanggan.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
                <ShieldCheck className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900">Kontrol akses akun</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Gunakan kata sandi yang unik, minimal 8 karakter, dan jangan dipakai ulang di akun lain.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <KeyRound className="size-4" />
                  Ubah Kata Sandi
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        isSubmitting={changePasswordMutation.isPending}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={(values) => void handleChangePassword(values)}
      />
    </>
  )
}

export default CustomerSettingsPage
