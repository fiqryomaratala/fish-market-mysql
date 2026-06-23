import { Bell } from 'lucide-react'
import Pagination from '@/components/admin/users/Pagination'
import type { NotificationItem } from '@/types/notification'
import { NotificationCard } from './NotificationCard'

type NotificationListProps = {
  notifications: NotificationItem[]
  currentPage: number
  totalPages: number
  totalItems: number
  activeMarkingId?: number | null
  activeDeletingId?: number | null
  onPageChange: (page: number) => void
  onViewDetail: (notification: NotificationItem) => void
  onMarkAsRead: (notification: NotificationItem) => void
  onDelete: (notification: NotificationItem) => void
}

export function NotificationList({
  notifications,
  currentPage,
  totalPages,
  totalItems,
  activeMarkingId,
  activeDeletingId,
  onPageChange,
  onViewDetail,
  onMarkAsRead,
  onDelete,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center shadow-lg shadow-slate-200/20">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-white shadow-sm">
          <Bell className="size-7 text-slate-300" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-900">Tidak ada notifikasi</h3>
        <p className="mt-2 text-sm text-slate-500">
          Belum ada notifikasi yang cocok dengan pencarian atau filter saat ini.
        </p>
      </div>
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Daftar Notifikasi</h2>
          <p className="text-sm text-slate-500">Menampilkan {totalItems} notifikasi</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            isMarkingAsRead={activeMarkingId === notification.id}
            isDeleting={activeDeletingId === notification.id}
            onViewDetail={onViewDetail}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
          />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </section>
  )
}
