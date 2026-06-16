import { useEffect, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderCircle, Save, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { UpdateProfilePayload, UserProfile } from '@/types/profile'

const editProfileSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi'),
  phone: z.string().trim().min(1, 'Nomor telepon wajib diisi'),
  address: z.string().trim().min(1, 'Alamat wajib diisi'),
})

type EditProfileFormValues = z.infer<typeof editProfileSchema>

type EditProfileFormProps = {
  profile: UserProfile
  isSubmitting: boolean
  onCancel: () => void
  onSubmit: (values: UpdateProfilePayload) => void
}

export function EditProfileForm({
  profile,
  isSubmitting,
  onCancel,
  onSubmit,
}: EditProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    },
  })

  useEffect(() => {
    reset({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
    })
  }, [profile, reset])

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="profile-card rounded-xl border border-slate-200 bg-gradient-to-br from-cyan-50/80 via-white to-emerald-50/60 p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Edit Profil</h2>
          <p className="mt-1 text-sm text-slate-500">
            Perbarui nama, kontak, dan alamat akun pelanggan.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field
          label="Nama"
          error={errors.name?.message}
          input={
            <input
              {...register('name')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          }
        />
        <Field
          label="Nomor Telepon"
          error={errors.phone?.message}
          input={
            <input
              {...register('phone')}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          }
        />
        <Field
          label="Alamat"
          error={errors.address?.message}
          className="md:col-span-2"
          input={
            <textarea
              {...register('address')}
              rows={4}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          }
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:from-sky-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <X className="size-4" />
          Batal
        </button>
      </div>
    </form>
  )
}

type FieldProps = {
  label: string
  input: ReactNode
  error?: string
  className?: string
}

function Field({ label, input, error, className }: FieldProps) {
  return (
    <label className={className}>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {input}
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </label>
  )
}
