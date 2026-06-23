import { Bell, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { NotificationItem } from '@/types/notification'
import { getNotificationTypeLabel } from '@/types/notification'
import { formatRelativeTime } from '@/utils/format'

type NotificationDropdownProps = {
  notifications: NotificationItem[]
  unreadCount: number
  isLoading: boolean
  isError: boolean
  notificationsPath: string
  onRetry: () => void
  onClose: () => void
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  isLoading,
  isError,
  notificationsPath,
  onRetry,
  onClose,
}: NotificationDropdownProps) {
  return (
    <div className="absolute right-0 top-full z-40 mt-3 w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-2 pb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Notifikasi</p>
          <p className="text-xs text-slate-500">{unreadCount} notifikasi belum dibaca</p>
        </div>
        <Link
          to={notificationsPath}
          onClick={onClose}
          className="text-xs font-semibold text-cyan-600 transition hover:text-cyan-700"
        >
          Lihat Semua Notifikasi
        </Link>
      </div>

      <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto scrollbar-hidden">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-xl border border-slate-200 p-3">
              <div className="h-4 w-32 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
            </div>
          ))
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-red-600">Gagal memuat notifikasi.</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Coba Lagi
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
            <Bell className="mx-auto size-8 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">Belum ada notifikasi terbaru</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Link
              key={notification.id}
              to={notificationsPath}
              onClick={onClose}
              className="block rounded-xl border border-slate-200 p-3 transition hover:border-cyan-200 hover:bg-cyan-50/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {notification.title}
                    </p>
                    {!notification.is_read ? (
                      <span className="size-2 rounded-full bg-emerald-500" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {notification.message}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{getNotificationTypeLabel(notification.type)}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(notification.created_at)}</span>
                  </div>
                </div>
                <ChevronRight className="mt-1 size-4 shrink-0 text-slate-300" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
