import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ChangePasswordPayload } from '@/types/profile'

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Kata sandi lama wajib diisi'),
    new_password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
    confirm_password: z.string().min(8, 'Konfirmasi kata sandi minimal 8 karakter'),
  })
  .refine((values) => values.new_password === values.confirm_password, {
    message: 'Konfirmasi kata sandi harus sama',
    path: ['confirm_password'],
  })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
type PasswordFieldKey = keyof ChangePasswordFormValues

type ChangePasswordModalProps = {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (payload: ChangePasswordPayload) => void
}

const defaultVisibilityState: Record<PasswordFieldKey, boolean> = {
  current_password: false,
  new_password: false,
  confirm_password: false,
}

export function ChangePasswordModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  })
  const [visibility, setVisibility] = useState(defaultVisibilityState)

  const toggleVisibility = (field: PasswordFieldKey) => {
    setVisibility((current) => ({
      ...current,
      [field]: !current[field],
    }))
  }

  const handleClose = () => {
    reset()
    setVisibility(defaultVisibilityState)
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="profile-card w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100">
              <LockKeyhole className="size-5 text-sky-700" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">Ubah Kata Sandi</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pastikan kata sandi baru kuat dan hanya diketahui oleh Anda.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((values) =>
            onSubmit(
              {
                current_password: values.current_password,
                new_password: values.new_password,
                confirm_password: values.confirm_password,
              },
            )
          )}
          className="mt-6 space-y-4"
        >
          <PasswordField
            label="Kata Sandi Lama"
            field="current_password"
            error={errors.current_password?.message}
            placeholder="Masukkan kata sandi lama"
            isVisible={visibility.current_password}
            register={register}
            onToggleVisibility={toggleVisibility}
            focusRingClassName="focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100"
          />
          <PasswordField
            label="Kata Sandi Baru"
            field="new_password"
            error={errors.new_password?.message}
            placeholder="Masukkan kata sandi baru"
            isVisible={visibility.new_password}
            register={register}
            onToggleVisibility={toggleVisibility}
            focusRingClassName="focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100"
          />
          <PasswordField
            label="Konfirmasi Kata Sandi"
            field="confirm_password"
            error={errors.confirm_password?.message}
            placeholder="Ulangi kata sandi baru"
            isVisible={visibility.confirm_password}
            register={register}
            onToggleVisibility={toggleVisibility}
            focusRingClassName="focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-100"
          />

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              <p>Kata sandi baru harus memiliki minimal 8 karakter.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:from-sky-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LockKeyhole className="size-4" />
              )}
              Simpan Kata Sandi
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

type PasswordFieldProps = {
  label: string
  field: PasswordFieldKey
  error?: string
  placeholder: string
  isVisible: boolean
  focusRingClassName: string
  register: ReturnType<typeof useForm<ChangePasswordFormValues>>['register']
  onToggleVisibility: (field: PasswordFieldKey) => void
}

function PasswordField({
  label,
  field,
  error,
  placeholder,
  isVisible,
  focusRingClassName,
  register,
  onToggleVisibility,
}: PasswordFieldProps) {
  const registration = register(field)
  const EyeIcon: LucideIcon = isVisible ? Eye : EyeOff

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div
        className={`relative rounded-xl border border-slate-200 bg-white transition ${focusRingClassName}`}
      >
        <input
          {...registration}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          className="w-full rounded-xl bg-transparent px-4 py-3 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => onToggleVisibility(field)}
          className="absolute inset-y-0 right-3 inline-flex items-center justify-center text-gray-400 transition hover:text-gray-600"
          aria-label={isVisible ? `Sembunyikan ${label.toLowerCase()}` : `Tampilkan ${label.toLowerCase()}`}
          aria-pressed={isVisible}
        >
          <EyeIcon className="h-5 w-5" />
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-rose-500">{error}</p> : null}
    </label>
  )
}
