import { Bell, Package, ShoppingBag, Sparkles } from 'lucide-react'
import { getNotificationTypeLabel, normalizeNotificationType, type NotificationItem } from '@/types/notification'

type NotificationsCenterCardProps = {
  notification: NotificationItem
  isMarkingAsRead?: boolean
  onMarkAsRead?: (notification: NotificationItem) => void
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function getNotificationIcon(type: string) {
  const normalized = normalizeNotificationType(type)

  if (normalized === 'ORDER') {
    return Package
  }

  if (normalized === 'INVENTORY') {
    return ShoppingBag
  }

  if (normalized === 'HARVEST' || normalized === 'BATCH' || normalized === 'FEEDING') {
    return Sparkles
  }

  return Bell
}

function getTypeBadgeClassName(type: string) {
  const normalized = normalizeNotificationType(type)

  if (normalized === 'ORDER') {
    return 'border-blue-200 bg-blue-50 text-blue-700'
  }

  if (normalized === 'INVENTORY') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }

  if (normalized === 'HARVEST' || normalized === 'BATCH' || normalized === 'FEEDING') {
    return 'border-amber-200 bg-amber-50 text-amber-700'
  }

  return 'border-slate-200 bg-slate-50 text-slate-600'
}

export function NotificationsCenterCard({
  notification,
  isMarkingAsRead,
  onMarkAsRead,
}: NotificationsCenterCardProps) {
  const Icon = getNotificationIcon(notification.type)

  return (
    <article
      className={`rounded-[1.5rem] border bg-white p-5 shadow-lg shadow-slate-200/60 transition ${
        notification.is_read
          ? 'border-slate-200'
          : 'border-blue-100 bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(239,246,255,0.45)_100%)]'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {notification.title}
            </h3>
            <span
              className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getTypeBadgeClassName(notification.type)}`}
            >
              {getNotificationTypeLabel(notification.type)}
            </span>
            {!notification.is_read ? (
              <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                Baru
              </span>
            ) : null}
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-500">{notification.message}</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-slate-400">
              {notification.created_at
                ? dateFormatter.format(new Date(notification.created_at))
                : '-'}
            </p>

            {!notification.is_read && onMarkAsRead ? (
              <button
                type="button"
                onClick={() => onMarkAsRead(notification)}
                disabled={isMarkingAsRead}
                className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isMarkingAsRead ? 'Memproses...' : 'Tandai Dibaca'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
