import {
  BellDot,
  BellRing,
  CheckCheck,
  Inbox,
  RefreshCcw,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  LoadingSkeleton,
  NotificationDetailModal,
  NotificationList,
  SearchFilter,
  SummaryCard,
} from '@/components/admin/notifications'
import {
  useDebouncedValue,
  useDeleteNotification,
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  usePageTitle,
} from '@/hooks'
import type {
  NotificationItem,
  NotificationStatusFilter,
  NotificationTypeFilter,
} from '@/types/notification'
import { getNotificationTypeQueryValue } from '@/types/notification'

const PAGE_SIZE = 10

function isToday(value: string) {
  if (!value) {
    return false
  }

  const date = new Date(value)
  const now = new Date()

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

function filterNotifications(
  notifications: NotificationItem[],
  search: string,
  status: NotificationStatusFilter,
) {
  const keyword = search.trim().toLowerCase()

  return notifications.filter((notification) => {
    const matchesSearch =
      !keyword ||
      notification.title.toLowerCase().includes(keyword) ||
      notification.message.toLowerCase().includes(keyword)

    const matchesStatus =
      status === 'all' ||
      (status === 'read' && notification.is_read) ||
      (status === 'unread' && !notification.is_read)

    return matchesSearch && matchesStatus
  })
}

export function NotificationsCenterPage() {
  usePageTitle('Notifikasi')

  const [searchValue, setSearchValue] = useState('')
  const [typeFilter, setTypeFilter] = useState<NotificationTypeFilter>('all')
  const [statusFilter, setStatusFilter] = useState<NotificationStatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)

  const debouncedSearch = useDebouncedValue(searchValue, 300)
  const typeQueryValue = getNotificationTypeQueryValue(typeFilter)

  const allNotificationsQuery = useNotifications({ page: 1, limit: 1000 })
  const notificationsQuery = useNotifications({
    page: 1,
    limit: 1000,
    type: typeQueryValue,
  })
  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()
  const deleteNotificationMutation = useDeleteNotification()

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, statusFilter, typeFilter])

  const allNotifications = allNotificationsQuery.data?.items ?? []
  const typeScopedNotifications = notificationsQuery.data?.items ?? []

  const filteredNotifications = useMemo(
    () =>
      filterNotifications(typeScopedNotifications, debouncedSearch, statusFilter).sort(
        (left, right) => new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
      ),
    [debouncedSearch, statusFilter, typeScopedNotifications],
  )

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE))
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  const summary = useMemo(() => {
    const unreadCount = allNotifications.filter((notification) => !notification.is_read).length
    const readCount = allNotifications.length - unreadCount
    const todayCount = allNotifications.filter((notification) => isToday(notification.created_at)).length

    return {
      total: allNotifications.length,
      unread: unreadCount,
      read: readCount,
      today: todayCount,
    }
  }, [allNotifications])

  const isInitialLoading =
    (allNotificationsQuery.isLoading && !allNotificationsQuery.data) ||
    (notificationsQuery.isLoading && !notificationsQuery.data)

  const isError = allNotificationsQuery.isError || notificationsQuery.isError

  const handleRefresh = () => {
    void allNotificationsQuery.refetch()
    void notificationsQuery.refetch()
  }

  const handleMarkAsRead = (notification: NotificationItem) => {
    if (notification.is_read) {
      return
    }

    markAsReadMutation.mutate(notification.id)
  }

  const handleMarkAllAsRead = () => {
    if (summary.unread === 0) {
      return
    }

    markAllAsReadMutation.mutate()
  }

  const handleDeleteNotification = (notification: NotificationItem) => {
    const confirmed = window.confirm(`Hapus notifikasi "${notification.title}"?`)

    if (!confirmed) {
      return
    }

    deleteNotificationMutation.mutate(notification.id, {
      onSuccess: () => {
        if (selectedNotification?.id === notification.id) {
          setSelectedNotification(null)
        }
      },
    })
  }

  if (isInitialLoading) {
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Pusat Notifikasi
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pusat Notifikasi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pantau semua notifikasi operasional, sistem, dan aktivitas pengguna dalam satu tempat.
          </p>
        </section>
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Pusat Notifikasi
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Pusat Notifikasi</h1>
          <p className="mt-2 text-sm text-slate-500">
            Pantau semua notifikasi operasional, sistem, dan aktivitas pengguna dalam satu tempat.
          </p>
        </section>

        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-10 text-center shadow-lg">
          <div className="rounded-full bg-red-100 p-5">
            <RefreshCcw className="size-10 text-red-500" />
          </div>
          <h2 className="mt-5 text-xl font-semibold text-slate-900">Gagal memuat notifikasi</h2>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Terjadi kendala saat mengambil data notifikasi dari backend.
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-6 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
          Pusat Notifikasi
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Pusat Notifikasi</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Kelola notifikasi order, inventaris, panen, fish batch, feeding, sistem, dan user
              dengan tampilan yang rapi dan responsif.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-700">
            {summary.unread > 0
              ? `${summary.unread} notifikasi belum dibaca dan perlu ditindaklanjuti`
              : 'Semua notifikasi sudah dibaca'}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Notifikasi"
          value={summary.total}
          description="Total seluruh notifikasi yang tersedia."
          icon={Inbox}
          tone="primary"
        />
        <SummaryCard
          title="Belum Dibaca"
          value={summary.unread}
          description="Notifikasi yang belum dibaca."
          icon={BellDot}
          tone="warning"
        />
        <SummaryCard
          title="Sudah Dibaca"
          value={summary.read}
          description="Notifikasi yang sudah dibaca."
          icon={CheckCheck}
          tone="success"
        />
        <SummaryCard
          title="Notifikasi Hari Ini"
          value={summary.today}
          description="Notifikasi yang masuk hari ini."
          icon={BellRing}
          tone="slate"
        />
      </section>

      <SearchFilter
        searchValue={searchValue}
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        isRefreshing={allNotificationsQuery.isFetching || notificationsQuery.isFetching}
        isMarkingAll={markAllAsReadMutation.isPending}
        onSearchChange={setSearchValue}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onRefresh={handleRefresh}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <NotificationList
        notifications={paginatedNotifications}
        currentPage={Math.min(currentPage, totalPages)}
        totalPages={totalPages}
        totalItems={filteredNotifications.length}
        activeMarkingId={markAsReadMutation.variables ?? null}
        activeDeletingId={deleteNotificationMutation.variables ?? null}
        onPageChange={setCurrentPage}
        onViewDetail={setSelectedNotification}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDeleteNotification}
      />

      <NotificationDetailModal
        isOpen={Boolean(selectedNotification)}
        notificationId={selectedNotification?.id}
        fallbackNotification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </div>
  )
}
