import { Bell, RefreshCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { NotificationsCenterCard } from '@/components/customer/NotificationsCenterCard'
import { Pagination } from '@/components/marketplace/Pagination'
import { SortDropdown } from '@/components/marketplace/SortDropdown'
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
  usePageTitle,
} from '@/hooks'
import {
  getNotificationTypeLabel,
  normalizeNotificationType,
  type NotificationItem,
  type NotificationStatusFilter,
} from '@/types/notification'

const PAGE_SIZE = 6

type TypeFilter = 'all' | 'ORDER' | 'INVENTORY' | 'HARVEST' | 'SYSTEM'

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (typeof response?.data?.message === 'string' && response.data.message) {
      return response.data.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Terjadi kesalahan. Silakan coba lagi.'
}

function CustomerNotificationsPage() {
  usePageTitle('Notifikasi Pelanggan')

  const navigate = useNavigate()
  const notificationsQuery = useNotifications({ page: 1, limit: 1000 })
  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<NotificationStatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const notifications = notificationsQuery.data?.items ?? []

  const summary = useMemo(() => {
    const unread = notifications.filter((notification) => !notification.is_read).length
    const order = notifications.filter(
      (notification) => normalizeNotificationType(notification.type) === 'ORDER',
    ).length

    return {
      total: notifications.length,
      unread,
      order,
    }
  }, [notifications])

  const filteredNotifications = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return notifications.filter((notification) => {
      const matchesSearch =
        keyword.length === 0 ||
        notification.title.toLowerCase().includes(keyword) ||
        notification.message.toLowerCase().includes(keyword)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'read' && notification.is_read) ||
        (statusFilter === 'unread' && !notification.is_read)
      const normalizedType = normalizeNotificationType(notification.type)
      const matchesType = typeFilter === 'all' || normalizedType === typeFilter

      return matchesSearch && matchesStatus && matchesType
    })
  }, [notifications, search, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedNotifications = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredNotifications.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredNotifications, safeCurrentPage])

  const statusOptions: { label: string; value: NotificationStatusFilter }[] = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Belum Dibaca', value: 'unread' },
    { label: 'Sudah Dibaca', value: 'read' },
  ]
  const typeOptions: { label: string; value: TypeFilter }[] = [
    { label: 'Semua Tipe', value: 'all' },
    { label: getNotificationTypeLabel('ORDER'), value: 'ORDER' },
    { label: getNotificationTypeLabel('INVENTORY'), value: 'INVENTORY' },
    { label: getNotificationTypeLabel('HARVEST'), value: 'HARVEST' },
    { label: getNotificationTypeLabel('SYSTEM'), value: 'SYSTEM' },
  ]

  const handleMarkAsRead = async (notification: NotificationItem) => {
    try {
      await markAsReadMutation.mutateAsync(notification.id)
      toast.success('Notifikasi ditandai sudah dibaca.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync()
      toast.success('Semua notifikasi berhasil ditandai sudah dibaca.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleResetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setTypeFilter('all')
    setCurrentPage(1)
  }

  if (notificationsQuery.isLoading) {
    return <div className="h-80 animate-pulse rounded-[1.75rem] bg-slate-200" />
  }

  if (notificationsQuery.isError) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/70">
        <div className="rounded-full bg-red-50 p-5 text-red-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Gagal memuat notifikasi customer
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Data notifikasi belum bisa diambil dari server. Coba muat ulang halaman ini.
        </p>
        <button
          type="button"
          onClick={() => void notificationsQuery.refetch()}
          className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eff6ff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-blue-600">
              Notification Center
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              Lihat semua pembaruan akun dan pesanan Anda dalam satu tempat.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
              Pantau status order, info stok, dan update sistem dengan tampilan yang rapi dan
              mudah dipindai.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void notificationsQuery.refetch()}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <RefreshCcw className="size-4" />
              Muat Ulang
            </button>
            <button
              type="button"
              onClick={() => void handleMarkAllAsRead()}
              disabled={summary.unread === 0 || markAllAsReadMutation.isPending}
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {markAllAsReadMutation.isPending ? 'Memproses...' : 'Tandai Semua Dibaca'}
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Total Notifikasi
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.total}</p>
          <p className="mt-2 text-sm text-slate-500">Semua update yang masuk ke akun customer.</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-[linear-gradient(180deg,_rgba(255,255,255,1)_0%,_rgba(239,246,255,0.62)_100%)] p-5 shadow-lg shadow-blue-100/50">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Belum Dibaca
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.unread}</p>
          <p className="mt-2 text-sm text-slate-500">Notifikasi baru yang masih perlu perhatian.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
            Update Order
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">{summary.order}</p>
          <p className="mt-2 text-sm text-slate-500">Ringkasan notifikasi yang berkaitan dengan pesanan.</p>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Filter Notifikasi
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Cari update yang Anda butuhkan</h2>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Reset Filter
          </button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,0.8fr))]">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search className="size-4 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setCurrentPage(1)
              }}
              placeholder="Cari judul atau isi notifikasi..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <SortDropdown
            label="Status"
            value={statusFilter}
            options={statusOptions}
            placeholder="Semua Status"
            width="full"
            align="left"
            onChange={(value) => {
              setStatusFilter(value as NotificationStatusFilter)
              setCurrentPage(1)
            }}
          />

          <SortDropdown
            label="Tipe"
            value={typeFilter}
            options={typeOptions}
            placeholder="Semua Tipe"
            width="full"
            align="left"
            onChange={(value) => {
              setTypeFilter(value as TypeFilter)
              setCurrentPage(1)
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            Menampilkan <span className="font-semibold text-slate-900">{filteredNotifications.length}</span>{' '}
            notifikasi
          </p>
          <p>
            Fokus saat ini:{' '}
            <span className="font-semibold text-blue-600">
              {typeFilter === 'all' ? 'semua tipe' : getNotificationTypeLabel(typeFilter)}
            </span>
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {paginatedNotifications.length > 0 ? (
          paginatedNotifications.map((notification) => (
            <NotificationsCenterCard
              key={notification.id}
              notification={notification}
              isMarkingAsRead={
                markAsReadMutation.isPending && markAsReadMutation.variables === notification.id
              }
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/60">
            <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Bell className="size-10" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">Tidak ada notifikasi yang cocok.</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
              Coba ubah pencarian atau filter agar hasil yang tampil lebih sesuai.
            </p>
            <button
              type="button"
              onClick={() => navigate('/customer/marketplace')}
              className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Kunjungi Marketplace
            </button>
          </div>
        )}
      </section>

      {filteredNotifications.length > PAGE_SIZE ? (
        <Pagination
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : null}
    </div>
  )
}

export default CustomerNotificationsPage
