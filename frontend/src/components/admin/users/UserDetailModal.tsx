import { X, Mail, Phone, MapPin, Shield, Activity, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { useUser } from '@/hooks/useUser'

interface UserDetailModalProps {
  isOpen: boolean
  userId: number | null
  onClose: () => void
}

function UserDetailModal({ isOpen, userId, onClose }: UserDetailModalProps) {
  const { data: user, isLoading } = useUser(userId)

  if (!isOpen) return null

  const getRoleBadgeColor = (role: string) => {
    if (role === 'Admin') return 'bg-red-100 text-red-700'
    if (role === 'Staff') return 'bg-blue-100 text-blue-700'
    return 'bg-green-100 text-green-700'
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === 'Active') return 'bg-green-100 text-green-700'
    if (status === 'Inactive') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    try {
      return format(new Date(dateString), 'dd MMMM yyyy HH:mm', { locale: localeId })
    } catch {
      return '-'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 p-6">
          <h2 className="text-xl font-semibold text-slate-900">Detail User</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
              <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ) : user ? (
          <div className="p-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">{user.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                </div>

                <div className="flex gap-3">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRoleBadgeColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeColor(user.status)}`}
                  >
                    {user.status === 'Active' ? 'Aktif' : user.status === 'Inactive' ? 'Tidak Aktif' : 'Ditangguhkan'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Email</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <Phone className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Telepon</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{user.phone || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Alamat</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{user.address || '-'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <Shield className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Role</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{user.role}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <Activity className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {user.status === 'Active' ? 'Aktif' : user.status === 'Inactive' ? 'Tidak Aktif' : 'Ditangguhkan'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Login Terakhir</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(user.last_login)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="rounded-lg bg-white p-2 text-slate-600">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Dibuat</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{formatDate(user.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-slate-600">User tidak ditemukan</p>
          </div>
        )}

        <div className="border-t border-slate-100 p-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetailModal
