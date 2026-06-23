import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import type { User, UserCreateInput, UserUpdateInput } from '@/types/user'

const createSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  email: z.string().min(1, 'Email harus diisi').email('Format email tidak valid'),
  phone: z.string().min(1, 'Telepon harus diisi'),
  address: z.string().min(1, 'Alamat harus diisi'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['Admin', 'Staff', 'Customer'], { message: 'Role harus dipilih' }),
  status: z.enum(['Active', 'Inactive', 'Suspended'], { message: 'Status harus dipilih' }),
})

const updateSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  phone: z.string().min(1, 'Telepon harus diisi'),
  address: z.string().min(1, 'Alamat harus diisi'),
  role: z.enum(['Admin', 'Staff', 'Customer'], { message: 'Role harus dipilih' }),
  status: z.enum(['Active', 'Inactive', 'Suspended'], { message: 'Status harus dipilih' }),
})

type CreateFormData = z.infer<typeof createSchema>
type UpdateFormData = z.infer<typeof updateSchema>

interface UserFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit'
  user: User | null
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: UserCreateInput | UserUpdateInput) => void
}

function UserFormModal({ isOpen, mode, user, isSubmitting, onClose, onSubmit }: UserFormModalProps) {
  const isCreate = mode === 'create'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateFormData | UpdateFormData>({
    resolver: zodResolver(isCreate ? createSchema : updateSchema),
  })

  useEffect(() => {
    if (isOpen && user && mode === 'edit') {
      reset({
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role as 'Admin' | 'Staff' | 'Customer',
        status: user.status as 'Active' | 'Inactive' | 'Suspended',
      })
    } else if (isOpen && mode === 'create') {
      reset({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        role: 'Customer',
        status: 'Active',
      })
    }
  }, [isOpen, mode, user, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: CreateFormData | UpdateFormData) => {
    onSubmit(data as UserCreateInput | UserUpdateInput)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isCreate ? 'Tambah User Baru' : 'Edit User'}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isCreate ? 'Lengkapi formulir di bawah untuk menambah user baru' : 'Perbarui informasi user'}
            </p>
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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {isCreate && (
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email' as keyof CreateFormData)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="user@example.com"
                />
                {'email' in errors && errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                Telepon <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="08123456789"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                {...register('address')}
                disabled={isSubmitting}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Masukkan alamat lengkap"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
              )}
            </div>

            {isCreate && (
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password' as keyof CreateFormData)}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Minimal 8 karakter"
                />
                {'password' in errors && errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  {...register('role')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Customer">Customer</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  {...register('status')}
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Active">Aktif</option>
                  <option value="Inactive">Tidak Aktif</option>
                  <option value="Suspended">Ditangguhkan</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
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
              {isSubmitting ? 'Menyimpan...' : isCreate ? 'Tambah User' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserFormModal
