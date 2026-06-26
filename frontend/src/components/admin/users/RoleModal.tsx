import { Shield, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { DropdownSelect } from '@/components/common/DropdownSelect'

const roleSchema = z.object({
  role: z.enum(['Admin', 'Staff', 'Customer'], { message: 'Role harus dipilih' }),
})

type RoleFormData = z.infer<typeof roleSchema>

interface RoleModalProps {
  isOpen: boolean
  userName: string
  currentRole: string
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: RoleFormData) => void
}

function RoleModal({
  isOpen,
  userName,
  currentRole,
  isSubmitting,
  onClose,
  onSubmit,
}: RoleModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      role: currentRole as 'Admin' | 'Staff' | 'Customer',
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: RoleFormData) => {
    onSubmit(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-cyan-100 p-2 text-cyan-700">
              <Shield className="size-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Ubah Role</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed"
          >
            <X className="size-5" />
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Ubah role untuk user <span className="font-semibold text-slate-900">{userName}</span>
        </p>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">
              Role <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <DropdownSelect
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  ariaLabel="Pilih role user"
                  options={[
                    { label: 'Admin', value: 'Admin' },
                    { label: 'Staff', value: 'Staff' },
                    { label: 'Customer', value: 'Customer' },
                  ]}
                />
              )}
            />
            {errors.role && (
              <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoleModal
