import {
  Boxes,
  Fish,
  PackageCheck,
  RefreshCcw,
  ShoppingBag,
  Users,
  Waves,
} from 'lucide-react'
import {
  DashboardCard,
} from '@/components/admin/dashboard/DashboardCard'
import { HarvestChart } from '@/components/admin/dashboard/HarvestChart'
import { HarvestSchedule } from '@/components/admin/dashboard/HarvestSchedule'
import { InventoryAlertCard } from '@/components/admin/dashboard/InventoryAlertCard'
import { LatestOrderTable } from '@/components/admin/dashboard/LatestOrderTable'
import { LoadingSkeleton } from '@/components/admin/dashboard/LoadingSkeleton'
import { RecentActivity } from '@/components/admin/dashboard/RecentActivity'
import { SalesChart } from '@/components/admin/dashboard/SalesChart'
import { TopSellingProduct } from '@/components/admin/dashboard/TopSellingProduct'
import {
  useAuth,
  useDashboardActivityLog,
  useDashboardSummary,
  useHarvestChart,
  useInventoryAlert,
  useLatestOrders,
  useSalesChart,
} from '@/hooks'
import { formatCompactCurrency } from '@/utils/format'

function AdminDashboardPage() {
  const { role } = useAuth()
  const summaryQuery = useDashboardSummary()
  const salesQuery = useSalesChart()
  const harvestQuery = useHarvestChart()
  const latestOrdersQuery = useLatestOrders()
  const inventoryAlertQuery = useInventoryAlert()
  const activityLogQuery = useDashboardActivityLog()

  const queries = [
    summaryQuery,
    salesQuery,
    harvestQuery,
    latestOrdersQuery,
    inventoryAlertQuery,
    activityLogQuery,
  ]

  const isLoading = queries.some((query) => query.isLoading)
  const isError = queries.some((query) => query.isError)

  if (role !== 'admin' && role !== 'staff') {
    return null
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white/80 px-6 py-12 text-center shadow-lg shadow-red-100/50 backdrop-blur-xl">
        <div className="rounded-full bg-red-50 p-5 text-red-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Gagal memuat dashboard admin
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Ada kendala saat mengambil ringkasan penjualan, panen, pesanan, inventaris, atau aktivitas.
        </p>
        <button
          type="button"
          onClick={() => {
            queries.forEach((query) => {
              void query.refetch()
            })
          }}
          className="mt-6 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-red-600"
        >
          Coba Lagi
        </button>
      </section>
    )
  }

  const summary = summaryQuery.data?.summary
  const sales = salesQuery.data
  const harvest = harvestQuery.data
  const latestOrders = latestOrdersQuery.data ?? []
  const inventoryAlerts = inventoryAlertQuery.data ?? []
  const activityLogs = activityLogQuery.data ?? []

  if (!summary || !sales || !harvest) {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-white/60 bg-linear-to-br from-slate-950 via-blue-950 to-sky-950 p-6 text-white shadow-lg shadow-slate-300/35">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/90">
              Pusat Kendali Admin
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Dashboard ERP untuk operasional Fish Marketplace
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-blue-50/78">
              Pantau pendapatan, pesanan, stok, jadwal panen, dan aktivitas tim dalam satu workspace
              yang ringan dan responsif.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/80">Pendapatan</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCompactCurrency(summary.total_revenue)}
              </p>
            </article>
            <article className="rounded-xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-100/80">Pesanan</p>
              <p className="mt-2 text-2xl font-semibold">{summary.total_orders}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DashboardCard
          title="Total Pendapatan"
          value={summary.total_revenue}
          icon={PackageCheck}
          tone="blue"
          prefix="currency"
        />
        <DashboardCard title="Total Pesanan" value={summary.total_orders} icon={ShoppingBag} tone="cyan" />
        <DashboardCard title="Total Produk" value={summary.total_products} icon={Boxes} tone="emerald" />
        <DashboardCard title="Total Pelanggan" value={summary.total_customers} icon={Users} tone="teal" />
        <DashboardCard title="Total Batch Ikan" value={summary.total_batches} icon={Fish} tone="cyan" />
        <DashboardCard title="Total Kolam" value={summary.total_ponds} icon={Waves} tone="emerald" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <SalesChart data={sales.series} />
        <TopSellingProduct product={sales.top_selling_product} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_420px]">
        <HarvestChart data={harvest.chart} />
        <HarvestSchedule items={harvest.schedule} />
      </section>

      <LatestOrderTable orders={latestOrders} />

      <section className="grid gap-6 xl:grid-cols-2">
        <InventoryAlertCard items={inventoryAlerts} />
        <RecentActivity items={activityLogs} />
      </section>
    </div>
  )
}

export default AdminDashboardPage
