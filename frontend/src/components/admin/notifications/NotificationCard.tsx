import {
  Bell,
  ClipboardList,
  Eye,
  Fish,
  Package,
  ReceiptText,
  Settings,
  Trash2,
  UserCircle2,
} from 'lucide-react'
import type { NotificationItem } from '@/types/notification'
import { getNotificationTypeLabel, normalizeNotificationType } from '@/types/notification'
import { formatDate, formatRelativeTime } from '@/utils/format'

type NotificationCardProps = {
  notification: NotificationItem
  isMarkingAsRead: boolean
  isDeleting: boolean
  onViewDetail: (notification: NotificationItem) => void
  onMarkAsRead: (notification: NotificationItem) => void
  onDelete: (notification: NotificationItem) => void
}

function getNotificationAppearance(type: string) {
  const normalized = normalizeNotificationType(type)

  if (normalized === 'ORDER') {
    return {
      icon: ReceiptText,
      badge: 'border-blue-100 bg-blue-50 text-blue-700',
      iconBox: 'bg-blue-50 text-blue-600',
    }
  }

  if (normalized === 'INVENTORY') {
    return {
      icon: Package,
      badge: 'border-orange-100 bg-orange-50 text-orange-700',
      iconBox: 'bg-orange-50 text-orange-600',
    }
  }

  if (normalized === 'HARVEST') {
    return {
      icon: Package,
      badge: 'border-emerald-100 bg-emerald-50 text-emerald-700',
      iconBox: 'bg-emerald-50 text-emerald-600',
    }
  }

  if (normalized === 'BATCH') {
    return {
      icon: Fish,
      badge: 'border-purple-100 bg-purple-50 text-purple-700',
      iconBox: 'bg-purple-50 text-purple-600',
    }
  }

  if (normalized === 'FEEDING') {
    return {
      icon: ClipboardList,
      badge: 'border-cyan-100 bg-cyan-50 text-cyan-700',
      iconBox: 'bg-cyan-50 text-cyan-600',
    }
  }

  if (normalized === 'USER') {
    return {
      icon: UserCircle2,
      badge: 'border-pink-100 bg-pink-50 text-pink-700',
      iconBox: 'bg-pink-50 text-pink-600',
    }
  }

  if (normalized === 'SYSTEM') {
    return {
      icon: Settings,
      badge: 'border-slate-200 bg-slate-100 text-slate-700',
      iconBox: 'bg-slate-100 text-slate-600',
    }
  }

  return {
    icon: Bell,
    badge: 'border-slate-200 bg-slate-100 text-slate-700',
    iconBox: 'bg-slate-100 text-slate-600',
  }
}

export function NotificationCard({
  notification,
  isMarkingAsRead,
  isDeleting,
  onViewDetail,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const appearance = getNotificationAppearance(notification.type)
  const Icon = appearance.icon

  return (
    <article
      className={`rounded-xl border bg-white p-5 shadow-lg shadow-slate-200/35 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 ${
        notification.is_read ? 'border-slate-200' : 'border-cyan-100'
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className={`mt-1 rounded-xl p-3 ${appearance.iconBox}`}>
            <Icon className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">{notification.title}</h3>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${appearance.badge}`}
              >
                {getNotificationTypeLabel(notification.type)}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  notification.is_read
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {notification.is_read ? 'Sudah Dibaca' : 'Belum Dibaca'}
              </span>
            </div>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
              {notification.message}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>{formatDate(notification.created_at, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              <span>{formatRelativeTime(notification.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <button
            type="button"
            onClick={() => onViewDetail(notification)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
          >
            <Eye className="size-4" />
            Lihat Detail
          </button>

          <button
            type="button"
            onClick={() => onMarkAsRead(notification)}
            disabled={notification.is_read || isMarkingAsRead}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMarkingAsRead ? 'Memproses...' : 'Tandai Dibaca'}
          </button>

          <button
            type="button"
            onClick={() => onDelete(notification)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </article>
  )
}
