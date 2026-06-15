import { Bell, RefreshCcw, ShoppingBag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LoadingSkeleton } from '@/components/customer/LoadingSkeleton'
import { NotificationCard } from '@/components/customer/NotificationCard'
import { ProfileCard } from '@/components/customer/ProfileCard'
import { QuickAction } from '@/components/customer/QuickAction'
import { RecentOrderCard } from '@/components/customer/RecentOrderCard'
import { StatisticsCard } from '@/components/customer/StatisticsCard'
import { TrackingCard } from '@/components/customer/TrackingCard'
import { WelcomeCard } from '@/components/customer/WelcomeCard'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { useNotifications } from '@/hooks/useNotifications'
import { useRecentOrders } from '@/hooks/useRecentOrders'

function parseProfileContact(shippingAddress: string) {
  const segments = shippingAddress
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean)

  return {
    phone: segments[1] ?? '-',
    address: segments.slice(2).join(', ') || '-',
  }
}

function CustomerDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const dashboardQuery = useDashboard()
  const recentOrdersQuery = useRecentOrders()
  const notificationsQuery = useNotifications({
    page: 1,
    limit: 5,
  })

  if (!user) {
    return null
  }

  if (dashboardQuery.isLoading || recentOrdersQuery.isLoading || notificationsQuery.isLoading) {
    return <LoadingSkeleton />
  }

  if (dashboardQuery.isError || recentOrdersQuery.isError || notificationsQuery.isError) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/70">
        <div className="rounded-full bg-red-50 p-5 text-red-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Gagal memuat dashboard customer
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Ada masalah saat mengambil ringkasan akun, order terbaru, atau notifikasi.
        </p>
        <button
          type="button"
          onClick={() => {
            void dashboardQuery.refetch()
            void recentOrdersQuery.refetch()
            void notificationsQuery.refetch()
          }}
          className="mt-6 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-600"
        >
          Retry
        </button>
      </div>
    )
  }

  const recentOrders = recentOrdersQuery.data?.orders ?? []
  const notifications = notificationsQuery.data?.items ?? []
  const latestShippingAddress = recentOrders[0]?.shipping_address ?? ''
  const contact = parseProfileContact(latestShippingAddress)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
      <div className="space-y-6">
        <WelcomeCard user={user} />
        <StatisticsCard
          summary={
            dashboardQuery.data ?? {
              total_orders: 0,
              completed_orders: 0,
              pending_orders: 0,
              total_spending: 0,
            }
          }
        />
        <QuickAction />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                Recent Orders
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Pesanan Terbaru</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/orders')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              View All
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => <RecentOrderCard key={order.id} order={order} />)
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                <ShoppingBag className="mx-auto size-10 text-slate-300" />
                <p className="mt-4 text-sm font-semibold text-slate-700">Belum ada order terbaru</p>
                <button
                  type="button"
                  onClick={() => navigate('/products')}
                  className="mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                >
                  Mulai Belanja
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <ProfileCard user={user} phone={contact.phone} address={contact.address} />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
                Recent Notification
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Notifikasi Terbaru</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/customer/notifications')}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              View All
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                <Bell className="mx-auto size-10 text-slate-300" />
                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Belum ada notifikasi terbaru
                </p>
              </div>
            )}
          </div>
        </section>

        <TrackingCard />
      </div>
    </div>
  )
}

export default CustomerDashboardPage
