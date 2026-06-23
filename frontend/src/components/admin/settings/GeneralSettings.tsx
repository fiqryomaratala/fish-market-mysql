import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { useUpdateGeneralSettings } from '@/hooks/use-settings'
import type { SettingsData } from '@/types/settings'

const generalSettingsSchema = z.object({
  application_name: z.string().min(1, 'Nama aplikasi wajib diisi'),
  company_name: z.string().min(1, 'Nama perusahaan wajib diisi'),
  company_email: z.string().email('Email perusahaan tidak valid').optional().or(z.literal('')),
  company_phone: z.string().min(1, 'Nomor telepon perusahaan wajib diisi'),
  company_address: z.string().min(1, 'Alamat perusahaan wajib diisi'),
  logo_url: z.string().url('URL logo tidak valid').optional().or(z.literal(''))
})

type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>

type GeneralSettingsProps = {
  settings?: SettingsData
}

export function GeneralSettings({ settings }: GeneralSettingsProps) {
  const updateGeneralSettingsMutation = useUpdateGeneralSettings()

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<GeneralSettingsFormData>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      application_name: settings?.application_name || '',
      company_name: settings?.company_name || '',
      company_email: settings?.company_email || '',
      company_phone: settings?.company_phone || '',
      company_address: settings?.company_address || '',
      logo_url: settings?.logo_url || ''
    }
  })

  const onSubmit = (data: GeneralSettingsFormData) => {
    updateGeneralSettingsMutation.mutate(data)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Pengaturan Umum</h2>
        <p className="mt-1 text-sm text-slate-500">
          Kelola informasi dasar aplikasi dan perusahaan
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Application Name */}
          <div>
            <label htmlFor="application_name" className="block text-sm font-medium text-slate-700">
              Nama Aplikasi *
            </label>
            <input
              type="text"
              id="application_name"
              {...register('application_name')}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.application_name
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
              }`}
              placeholder="FishMarket App"
            />
            {errors.application_name && (
              <p className="mt-1 text-xs text-red-600">{errors.application_name.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-slate-700">
              Nama Perusahaan *
            </label>
            <input
              type="text"
              id="company_name"
              {...register('company_name')}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.company_name
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
              }`}
              placeholder="PT. Budidaya Ikan Nusantara"
            />
            {errors.company_name && (
              <p className="mt-1 text-xs text-red-600">{errors.company_name.message}</p>
            )}
          </div>

          {/* Company Email */}
          <div>
            <label htmlFor="company_email" className="block text-sm font-medium text-slate-700">
              Email Perusahaan
            </label>
            <input
              type="email"
              id="company_email"
              {...register('company_email')}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.company_email
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
              }`}
              placeholder="info@company.com"
            />
            {errors.company_email && (
              <p className="mt-1 text-xs text-red-600">{errors.company_email.message}</p>
            )}
          </div>

          {/* Company Phone */}
          <div>
            <label htmlFor="company_phone" className="block text-sm font-medium text-slate-700">
              Telepon Perusahaan *
            </label>
            <input
              type="tel"
              id="company_phone"
              {...register('company_phone')}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.company_phone
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
              }`}
              placeholder="+6281234567890"
            />
            {errors.company_phone && (
              <p className="mt-1 text-xs text-red-600">{errors.company_phone.message}</p>
            )}
          </div>

          {/* Company Address */}
          <div className="sm:col-span-2">
            <label htmlFor="company_address" className="block text-sm font-medium text-slate-700">
              Alamat Perusahaan *
            </label>
            <textarea
              id="company_address"
              {...register('company_address')}
              rows={3}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.company_address
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
              }`}
              placeholder="Jl. Budidaya No. 123, Jakarta Selatan"
            />
            {errors.company_address && (
              <p className="mt-1 text-xs text-red-600">{errors.company_address.message}</p>
            )}
          </div>

          {/* Logo URL */}
          <div className="sm:col-span-2">
            <label htmlFor="logo_url" className="block text-sm font-medium text-slate-700">
              URL Logo
            </label>
            <input
              type="url"
              id="logo_url"
              {...register('logo_url')}
              className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                errors.logo_url
                  ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 bg-white focus:border-cyan-500 focus:ring-cyan-500'
              }`}
              placeholder="https://example.com/logo.png"
            />
            {errors.logo_url && (
              <p className="mt-1 text-xs text-red-600">{errors.logo_url.message}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              Masukkan URL lengkap ke gambar logo (PNG, JPG, atau SVG)
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={!isDirty || updateGeneralSettingsMutation.isPending}
            className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {updateGeneralSettingsMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Menyimpan...
              </span>
            ) : (
              'Simpan Pengaturan Umum'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}