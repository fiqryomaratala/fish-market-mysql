import { Bell, Package, ShoppingBag, Sparkles } from 'lucide-react'
import type { NotificationItem } from '@/types/notification'

type NotificationCardProps = {
  notification: NotificationItem
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

function getNotificationIcon(type: string) {
  const normalized = type.trim().toUpperCase()

  if (normalized === 'ORDER') {
    return Package
  }

  if (normalized === 'INVENTORY') {
    return ShoppingBag
  }

  if (normalized === 'HARVEST') {
    return Sparkles
  }

  return Bell
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const Icon = getNotificationIcon(notification.type)

  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-emerald-200 hover:bg-white">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-slate-900">{notification.title}</h3>
            {!notification.is_read ? (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                New
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{notification.message}</p>
          <p className="mt-3 text-xs font-medium text-slate-400">
            {notification.created_at
              ? dateFormatter.format(new Date(notification.created_at))
              : '-'}
          </p>
        </div>
      </div>
    </article>
  )
}
