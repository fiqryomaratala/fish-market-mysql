import { Eye } from 'lucide-react'
import type { ActivityLog } from '@/types/activity-log'
import {
  formatActivityDateTime,
  getActionLabel,
  getModuleLabel,
  getRoleLabel,
} from '@/pages/admin/activity-logs/activity-log.utils'

type ActivityLogRowProps = {
  log: ActivityLog
  onView: (log: ActivityLog) => void
}

function getActionTone(action: string) {
  const normalized = action.trim().toUpperCase()

  if (normalized.includes('DELETE')) {
    return 'bg-red-50 text-red-700 ring-red-100'
  }

  if (normalized.includes('UPDATE')) {
    return 'bg-amber-50 text-amber-700 ring-amber-100'
  }

  if (normalized.includes('CREATE') || normalized.includes('LOGIN')) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  return 'bg-slate-100 text-slate-700 ring-slate-200'
}

function getRoleTone(role: string) {
  const normalized = role.trim().toLowerCase()

  if (normalized === 'admin') {
    return 'bg-cyan-50 text-cyan-700 ring-cyan-100'
  }

  if (normalized === 'staff') {
    return 'bg-amber-50 text-amber-700 ring-amber-100'
  }

  if (normalized === 'customer') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  }

  return 'bg-slate-100 text-slate-600 ring-slate-200'
}

export function ActivityLogRow({ log, onView }: ActivityLogRowProps) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/80">
      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700">
        {formatActivityDateTime(log.created_at)}
      </td>
      <td className="px-4 py-4">
        <p className="font-semibold text-slate-900">{log.user_name || 'Sistem'}</p>
      </td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getRoleTone(log.user_role)}`}
        >
          {getRoleLabel(log.user_role)}
        </span>
      </td>
      <td className="px-4 py-4 text-sm font-medium text-slate-700">{getModuleLabel(log.module)}</td>
      <td className="px-4 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${getActionTone(log.action)}`}
        >
          {getActionLabel(log.action)}
        </span>
      </td>
      <td className="max-w-[320px] px-4 py-4 text-sm text-slate-600">
        <p className="line-clamp-2">{log.description || '-'}</p>
      </td>
      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">{log.ip_address || '-'}</td>
      <td className="px-4 py-4 text-right">
        <button
          type="button"
          onClick={() => onView(log)}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
        >
          <Eye className="size-4" />
          View Detail
        </button>
      </td>
    </tr>
  )
}
