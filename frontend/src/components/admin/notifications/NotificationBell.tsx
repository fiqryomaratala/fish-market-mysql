import { useEffect, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useNavigation, useNotifications } from '@/hooks'
import { NotificationDropdown } from './NotificationDropdown'

export function NotificationBell() {
  const { notificationsPath } = useNavigation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const notificationsQuery = useNotifications({ page: 1, limit: 1000 })
  const notifications = [...(notificationsQuery.data?.items ?? [])].sort(
    (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  )
  const unreadCount = notifications.filter((notification) => !notification.is_read).length
  const previewItems = notifications.slice(0, 5)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative cursor-pointer rounded-[14px] border border-slate-300 bg-slate-50 p-2.5 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700"
        aria-label="Notifikasi"
      >
        <Bell className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <NotificationDropdown
          notifications={previewItems}
          unreadCount={unreadCount}
          isLoading={notificationsQuery.isLoading}
          isError={notificationsQuery.isError}
          notificationsPath={notificationsPath}
          onRetry={() => void notificationsQuery.refetch()}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  )
}
