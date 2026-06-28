import { Edit2, Eye, MoreVertical, Shield, Trash2, UserCog } from 'lucide-react'
import { useState } from 'react'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import type { User } from '@/types/user'

interface UserRowProps {
  user: User
  onView: (user: User) => void
  onEdit: (user: User) => void
  onChangeRole: (user: User) => void
  onChangeStatus: (user: User) => void
  onDelete: (user: User) => void
}

function UserRow({ user, onView, onEdit, onChangeRole, onChangeStatus, onDelete }: UserRowProps) {
  const [showActions, setShowActions] = useState(false)

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
      return format(new Date(dateString), 'dd MMM yyyy', { locale: localeId })
    } catch {
      return '-'
    }
  }

  return (
    <tr className="border-b border-slate-50 transition hover:bg-slate-50/50">
      <td className="px-4 py-4">
        <div className="flex items-center justify-center">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="size-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <p className="font-medium text-slate-900">{user.name}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{user.email}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{user.phone || '-'}</p>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}
        >
          {user.role}
        </span>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeColor(user.status)}`}
        >
          {user.status === 'Active' ? 'Aktif' : user.status === 'Inactive' ? 'Tidak Aktif' : 'Ditangguhkan'}
        </span>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{formatDate(user.last_login)}</p>
      </td>
      <td className="px-4 py-4">
        <p className="text-sm text-slate-600">{formatDate(user.created_at)}</p>
      </td>
      <td className="px-4 py-4">
        <div className="relative flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onView(user)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            title="Lihat Detail"
          >
            <Eye className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
            title="Edit"
          >
            <Edit2 className="size-4" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowActions(!showActions)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
              title="Aksi Lainnya"
            >
              <MoreVertical className="size-4" />
            </button>
            {showActions && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowActions(false)}
                />
                <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      onChangeRole(user)
                      setShowActions(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <Shield className="size-4" />
                    Ubah Role
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeStatus(user)
                      setShowActions(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  >
                    <UserCog className="size-4" />
                    Ubah Status
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(user)
                      setShowActions(false)
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                    Hapus
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}

export default UserRow
