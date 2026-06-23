import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, IdCard, Loader2, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUpdateProfile } from '@/hooks/use-settings'
import type { ProfileData } from '@/types/settings'

const profileSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().optional(),
  address: z.string().optional(),
  avatar_url: z.string().url('URL avatar tidak valid').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

type ProfileSettingsProps = {
  profile?: ProfileData
}

export function ProfileSettings({ profile }: ProfileSettingsProps) {
  const updateProfileMutation = useUpdateProfile()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      address: profile?.address ?? '',
      avatar_url: profile?.avatar_url ?? '',
    },
  })

  useEffect(() => {
    reset({
      name: profile?.name ?? '',
      phone: profile?.phone ?? '',
      address: profile?.address ?? '',
      avatar_url: profile?.avatar_url ?? '',
    })
  }, [profile, reset])

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Profil Admin</h2>
        <p className="mt-1 text-sm text-slate-500">Perbarui informasi akun administrator.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.25fr)_320px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Nama Lengkap *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  errors.name
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="Nama administrator"
              />
              {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> : null}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Nomor Telepon
              </label>
              <input
                id="phone"
                type="text"
                {...register('phone')}
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  errors.phone
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="08xxxxxxxxxx"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="avatar_url" className="block text-sm font-medium text-slate-700">
                URL Avatar
              </label>
              <input
                id="avatar_url"
                type="url"
                {...register('avatar_url')}
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  errors.avatar_url
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="https://example.com/avatar.jpg"
              />
              {errors.avatar_url ? (
                <p className="mt-1 text-xs text-red-600">{errors.avatar_url.message}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700">
                Alamat
              </label>
              <textarea
                id="address"
                {...register('address')}
                rows={4}
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  errors.address
                    ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
                }`}
                placeholder="Jl. Contoh No. 123, Jakarta Selatan"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() =>
                reset({
                  name: profile?.name ?? '',
                  phone: profile?.phone ?? '',
                  address: profile?.address ?? '',
                  avatar_url: profile?.avatar_url ?? '',
                })
              }
              disabled={!isDirty || updateProfileMutation.isPending}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!isDirty || updateProfileMutation.isPending}
              className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {updateProfileMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                'Simpan Profil'
              )}
            </button>
          </div>
        </form>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Informasi Akun</p>
            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <IdCard className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-800">ID Pengguna</p>
                  <p>{profile?.id ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCcw className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-800">Role</p>
                  <p className="capitalize">{profile?.role ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-800">Terdaftar Sejak</p>
                  <p>{profile?.created_at ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 size-4 text-slate-400" />
                <div>
                  <p className="font-medium text-slate-800">Terakhir Diperbarui</p>
                  <p>{profile?.updated_at ?? '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Email Login</p>
            <p className="mt-2 text-sm text-slate-600">{profile?.email ?? '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
