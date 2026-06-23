// Halaman Analytics Dashboard untuk Admin
import { useState, useMemo } from 'react'
import { RefreshCcw, Calendar, Activity, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  AnalyticsFilter,
  KpiSection,
  RevenueChart,
  OrderChart,
  CustomerChart,
  HarvestChart,
  FeedChart,
  InventoryChart,
  PondChart,
  FishDistributionChart,
  TopSellingChart,
  InsightSection,
  SurvivalRateTable,
  InventoryAnalyticsTable,
  LoadingSkeleton,
} from '@/components/admin/analytics'
import {
  useAuth,
  usePageTitle,
  useAllAnalytics,
} from '@/hooks'
import type { DateFilterKey, DateFilterRange } from '@/types/analytics'

function formatAnalyticsDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function getFilterDateRange(value: DateFilterKey): DateFilterRange {
  const today = new Date()
  const end = new Date(today)
  const start = new Date(today)

  if (value === 'today') {
    return { start_date: formatAnalyticsDate(start), end_date: formatAnalyticsDate(end) }
  }

  if (value === 'last-7-days') {
    start.setDate(today.getDate() - 6)
    return { start_date: formatAnalyticsDate(start), end_date: formatAnalyticsDate(end) }
  }

  if (value === 'last-30-days') {
    start.setDate(today.getDate() - 29)
    return { start_date: formatAnalyticsDate(start), end_date: formatAnalyticsDate(end) }
  }

  if (value === 'this-month') {
    start.setDate(1)
    return { start_date: formatAnalyticsDate(start), end_date: formatAnalyticsDate(end) }
  }

  if (value === 'this-year') {
    start.setMonth(0, 1)
    return { start_date: formatAnalyticsDate(start), end_date: formatAnalyticsDate(end) }
  }

  // Custom range will use dates from state
  return { start_date: '', end_date: '' }
}

export default function AnalyticsDashboardPage() {
  usePageTitle('Analytics Dashboard')

  const { role } = useAuth()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeFilter, setActiveFilter] = useState<DateFilterKey>('last-30-days')
  const [submittedFilter, setSubmittedFilter] = useState<DateFilterRange>(
    getFilterDateRange('last-30-days')
  )

  // Use all analytics queries
  const allQueries = useAllAnalytics(submittedFilter)
  
  // Extract individual query results for easier access
  const [
    revenueQuery,
    orderQuery,
    customerQuery,
    harvestQuery,
    feedingQuery,
    inventoryQuery,
    pondQuery,
    fishBatchQuery,
  ] = allQueries

  // Combine loading states
  const isLoading = useMemo(() => allQueries.some(query => query.isLoading), [allQueries])
  
  // Combine error states
  const hasError = useMemo(() => allQueries.some(query => query.isError), [allQueries])
  
  // Combine fetching states
  const isFetching = useMemo(() => allQueries.some(query => query.isFetching), [allQueries])

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setActiveFilter('last-30-days')
    setSubmittedFilter(getFilterDateRange('last-30-days'))
  }

  const handleFilterChange = (filter: DateFilterKey) => {
    setActiveFilter(filter)
    if (filter === 'custom') {
      if (!startDate && !endDate) {
        toast.error('Pilih tanggal untuk rentang kustom.')
        return
      }

      setSubmittedFilter({
        start_date: startDate,
        end_date: endDate,
      })
      return
    }

    const range = getFilterDateRange(filter)
    setStartDate(range.start_date)
    setEndDate(range.end_date)
    setSubmittedFilter(range)
  }

  const handleStartDateChange = (value: string) => {
    setStartDate(value)
    setActiveFilter('custom')
  }

  const handleEndDateChange = (value: string) => {
    setEndDate(value)
    setActiveFilter('custom')
  }

  const handleRetry = () => {
    allQueries.forEach(query => {
      if (query.isError) {
        query.refetch()
      }
    })
  }

  // Check if any data is available
  const hasData = useMemo(() => {
    return !isLoading && !hasError && allQueries.some(query => query.data)
  }, [allQueries, isLoading, hasError])

  if (role !== 'admin') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
        <div className="rounded-full bg-slate-100 p-4 text-slate-400">
          <Activity className="size-7" />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Akses Ditolak</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Halaman Analytics Dashboard hanya dapat diakses oleh admin.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Analytics Dashboard
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Pusat analitik operasional budidaya ikan
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Monitor semua metrik bisnis dalam satu dashboard: penjualan, produksi, inventaris,
              konsumsi pakan, dan kesehatan pelanggan dengan visualisasi real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <span className="font-medium">Mode Admin</span> - Data diambil dari backend langsung
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <AnalyticsFilter
        startDate={startDate}
        endDate={endDate}
        activeFilter={activeFilter}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        isSubmitting={isFetching}
      />

      {/* Loading State */}
      {isLoading && <LoadingSkeleton />}

      {/* Error State */}
      {hasError && !isLoading && (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <RefreshCcw className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat data analitik</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Terjadi kendala saat mengambil data analitik dari backend. Silakan coba lagi.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            <RefreshCcw className="size-4" />
            Retry
          </button>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && !hasError && !hasData && (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Calendar className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">No Analytics Data Found</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Belum ada data analitik pada filter yang dipilih. Coba pilih periode lain.
          </p>
        </section>
      )}

      {/* Data Section - Only show when data is available */}
      {!isLoading && !hasError && hasData && (
        <div className="space-y-6">
          {/* KPI Section */}
          {revenueQuery.data && (
            <KpiSection data={revenueQuery.data.kpi} />
          )}

          {/* Insights Section */}
          {revenueQuery.data && (
            <InsightSection data={revenueQuery.data.insights} />
          )}

          {/* Charts Grid Section */}
          <div className="space-y-6">
            {/* Row 1: Revenue, Orders, Customers */}
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {revenueQuery.data?.trend && revenueQuery.data.trend.length > 0 && (
                <RevenueChart data={revenueQuery.data.trend} />
              )}
              
              {orderQuery.data?.trend && orderQuery.data.trend.length > 0 && (
                <OrderChart data={orderQuery.data.trend} />
              )}
              
              {customerQuery.data?.trend && customerQuery.data.trend.length > 0 && (
                <CustomerChart data={customerQuery.data.trend} />
              )}
            </div>

            {/* Row 2: Harvest, Feed, Inventory */}
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {harvestQuery.data?.trend && harvestQuery.data.trend.length > 0 && (
                <HarvestChart data={harvestQuery.data.trend} />
              )}
              
              {feedingQuery.data?.trend && feedingQuery.data.trend.length > 0 && (
                <FeedChart data={feedingQuery.data.trend} />
              )}
              
              {inventoryQuery.data?.trend && inventoryQuery.data.trend.length > 0 && (
                <InventoryChart data={inventoryQuery.data.trend} />
              )}
            </div>

            {/* Row 3: Pond Productivity, Fish Distribution, Top Selling */}
            <div className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {pondQuery.data?.productivity && pondQuery.data.productivity.length > 0 && (
                  <PondChart data={pondQuery.data.productivity} />
                )}
                
                {fishBatchQuery.data?.distribution && fishBatchQuery.data.distribution.length > 0 && (
                  <FishDistributionChart data={fishBatchQuery.data.distribution} />
                )}
              </div>
              
              {fishBatchQuery.data?.top_selling && fishBatchQuery.data.top_selling.length > 0 && (
                <TopSellingChart data={fishBatchQuery.data.top_selling} />
              )}
            </div>

            {/* Row 4: Tables Section */}
            <div className="space-y-6">
              {harvestQuery.data?.survival_rate && harvestQuery.data.survival_rate.length > 0 && (
                <SurvivalRateTable data={harvestQuery.data.survival_rate} />
              )}
              
                {inventoryQuery.data?.analytics && inventoryQuery.data.analytics.length > 0 && (
                <InventoryAnalyticsTable data={inventoryQuery.data.analytics} />
              )}
            </div>
          </div>

          {/* Summary Stats Footer */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
                  Dashboard Summary
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  Ringkasan metrik kunci
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  <Users className="size-4" />
                  <span>Data diperbarui otomatis dari backend</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Query Dijalankan</p>
                <p className="mt-1 text-xl font-bold text-slate-900">8 endpoints</p>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Total Charts</p>
                <p className="mt-1 text-xl font-bold text-slate-900">9 visualisasi</p>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Total Tables</p>
                <p className="mt-1 text-xl font-bold text-slate-900">2 tabel analisis</p>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Data Points</p>
                <p className="mt-1 text-xl font-bold text-slate-900">100+ data points</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
