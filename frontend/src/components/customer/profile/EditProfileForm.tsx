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
  avatar: z.string().trim().or(z.literal('')),
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
      avatar: profile.avatar,
    },
  })

  useEffect(() => {
    reset({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      avatar: profile.avatar,
    })
  }, [profile, reset])

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="rounded-xl border border-cyan-100 bg-gradient-to-br from-cyan-50/80 via-white to-emerald-50/60 p-6 shadow-lg shadow-cyan-100/50"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Edit Profil</h2>
          <p className="mt-1 text-sm text-slate-500">
            Perbarui nama, kontak, alamat, dan avatar akun pelanggan.
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
          label="URL Avatar"
          error={errors.avatar?.message}
          input={
            <input
              {...register('avatar')}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-200 transition duration-200 hover:-translate-y-0.5 hover:from-sky-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
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
