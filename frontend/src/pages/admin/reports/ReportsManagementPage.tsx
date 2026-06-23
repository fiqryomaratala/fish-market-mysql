import { useMemo, useState } from 'react'
import {
  Activity,
  Boxes,
  ClipboardList,
  Fish,
  PackageCheck,
  ReceiptText,
  RefreshCcw,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  CustomerTable,
  ExportSection,
  FeedingChart,
  FishBatchTable,
  HarvestChart,
  HarvestTable,
  InventoryTable,
  LoadingSkeleton,
  ReportFilter,
  ReportTabs,
  SalesChart,
  SalesTable,
  SummaryCard,
} from '@/components/admin/reports'
import {
  useAuth,
  useCustomerReport,
  useFeedingReport,
  useFishBatchReport,
  useHarvestReport,
  useInventoryReport,
  usePageTitle,
  useSalesReport,
} from '@/hooks'
import { reportService } from '@/services'
import type {
  QuickFilterKey,
  ReportDateFilter,
  ReportExportType,
  ReportTabKey,
} from '@/types/report'
import { formatCompactCurrency, formatNumber } from '@/utils/format'

function formatReportDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getQuickFilterRange(value: QuickFilterKey) {
  const today = new Date()
  const end = new Date(today)
  const start = new Date(today)

  if (value === 'today') {
    return { startDate: formatReportDate(start), endDate: formatReportDate(end) }
  }

  if (value === 'last-7-days') {
    start.setDate(today.getDate() - 6)
    return { startDate: formatReportDate(start), endDate: formatReportDate(end) }
  }

  if (value === 'last-30-days') {
    start.setDate(today.getDate() - 29)
    return { startDate: formatReportDate(start), endDate: formatReportDate(end) }
  }

  if (value === 'this-month') {
    start.setDate(1)
    return { startDate: formatReportDate(start), endDate: formatReportDate(end) }
  }

  start.setMonth(0, 1)
  return { startDate: formatReportDate(start), endDate: formatReportDate(end) }
}

function getExportType(tab: ReportTabKey): ReportExportType | null {
  if (tab === 'harvest') {
    return 'harvest'
  }

  if (tab === 'feeding') {
    return 'feeding'
  }

  if (tab === 'fish-batches') {
    return 'production'
  }

  return null
}

export default function ReportsManagementPage() {
  usePageTitle('Reports Management')

  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState<ReportTabKey>('sales')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterKey | null>(null)
  const [submittedFilter, setSubmittedFilter] = useState<ReportDateFilter>({})
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isExportingExcel, setIsExportingExcel] = useState(false)

  const salesQuery = useSalesReport(submittedFilter, { enabled: activeTab === 'sales' })
  const harvestQuery = useHarvestReport(submittedFilter, { enabled: activeTab === 'harvest' })
  const inventoryQuery = useInventoryReport(submittedFilter, { enabled: activeTab === 'inventory' })
  const feedingQuery = useFeedingReport(submittedFilter, { enabled: activeTab === 'feeding' })
  const fishBatchQuery = useFishBatchReport(submittedFilter, { enabled: activeTab === 'fish-batches' })
  const customerQuery = useCustomerReport(submittedFilter, { enabled: activeTab === 'customers' })

  const activeQuery = useMemo(() => {
    if (activeTab === 'sales') {
      return salesQuery
    }

    if (activeTab === 'harvest') {
      return harvestQuery
    }

    if (activeTab === 'inventory') {
      return inventoryQuery
    }

    if (activeTab === 'feeding') {
      return feedingQuery
    }

    if (activeTab === 'fish-batches') {
      return fishBatchQuery
    }

    return customerQuery
  }, [activeTab, customerQuery, feedingQuery, fishBatchQuery, harvestQuery, inventoryQuery, salesQuery])

  const handleGenerate = () => {
    setSubmittedFilter({
      start_date: startDate || undefined,
      end_date: endDate || undefined,
    })
  }

  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setActiveQuickFilter(null)
    setSubmittedFilter({})
  }

  const handleQuickFilter = (value: QuickFilterKey) => {
    const range = getQuickFilterRange(value)
    setStartDate(range.startDate)
    setEndDate(range.endDate)
    setActiveQuickFilter(value)
  }

  const exportType = getExportType(activeTab)
  const canExport = exportType !== null

  const exportHelperText = canExport
    ? 'File akan diunduh langsung dari backend sesuai tab aktif dan rentang tanggal yang dipilih.'
    : 'Backend saat ini belum menyediakan endpoint export khusus untuk tab ini. Export aktif untuk Harvest Report, Feeding Report, dan Fish Batch Report.'

  const handleExportPdf = async () => {
    if (!exportType) {
      toast.error('Export PDF belum tersedia untuk tab laporan ini.')
      return
    }

    try {
      setIsExportingPdf(true)
      await reportService.exportPdf(exportType, submittedFilter)
      toast.success('File PDF berhasil diunduh.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengunduh file PDF.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  const handleExportExcel = async () => {
    if (!exportType) {
      toast.error('Export Excel belum tersedia untuk tab laporan ini.')
      return
    }

    try {
      setIsExportingExcel(true)
      await reportService.exportExcel(exportType, submittedFilter)
      toast.success('File Excel berhasil diunduh.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal mengunduh file Excel.')
    } finally {
      setIsExportingExcel(false)
    }
  }

  if (role !== 'admin') {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Reports Management
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Pusat laporan operasional dan bisnis
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau penjualan, panen, inventaris, log pakan, batch ikan, dan pelanggan dalam satu
              halaman admin yang modern, responsif, dan siap dipakai di lingkungan produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Mode admin aktif. Semua data laporan diambil dari backend dengan autentikasi Bearer
            Token.
          </div>
        </div>
      </section>

      <ReportFilter
        startDate={startDate}
        endDate={endDate}
        activeQuickFilter={activeQuickFilter}
        onStartDateChange={(value) => {
          setStartDate(value)
          setActiveQuickFilter(null)
        }}
        onEndDateChange={(value) => {
          setEndDate(value)
          setActiveQuickFilter(null)
        }}
        onQuickFilterChange={handleQuickFilter}
        onGenerate={handleGenerate}
        onReset={handleReset}
        isSubmitting={activeQuery.isFetching}
      />

      <ReportTabs activeTab={activeTab} onChange={setActiveTab} />

      <ExportSection
        canExport={canExport}
        helperText={exportHelperText}
        isExportingPdf={isExportingPdf}
        isExportingExcel={isExportingExcel}
        onExportPdf={() => void handleExportPdf()}
        onExportExcel={() => void handleExportExcel()}
      />

      {activeQuery.isLoading ? <LoadingSkeleton /> : null}

      {!activeQuery.isLoading && activeQuery.isError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <RefreshCcw className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat laporan</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Terjadi kendala saat mengambil data laporan dari backend. Silakan coba lagi.
          </p>
          <button
            type="button"
            onClick={() => void activeQuery.refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700"
          >
            <RefreshCcw className="size-4" />
            Retry
          </button>
        </section>
      ) : null}

      {!activeQuery.isLoading && !activeQuery.isError && activeTab === 'sales' && salesQuery.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Revenue"
              value={formatCompactCurrency(salesQuery.data.summary.total_revenue)}
              description="Akumulasi nilai penjualan pada periode laporan aktif."
              icon={ReceiptText}
            />
            <SummaryCard
              title="Total Orders"
              value={formatNumber(salesQuery.data.summary.total_orders)}
              description="Jumlah pesanan yang tercatat dalam rentang tanggal aktif."
              icon={Activity}
              tone="emerald"
            />
            <SummaryCard
              title="Average Order Value"
              value={formatCompactCurrency(salesQuery.data.summary.average_order_value)}
              description="Rata-rata nilai transaksi per pesanan pelanggan."
              icon={ClipboardList}
              tone="amber"
            />
            <SummaryCard
              title="Completed Orders"
              value={formatNumber(salesQuery.data.summary.completed_orders)}
              description="Pesanan dengan status selesai pada periode yang sama."
              icon={PackageCheck}
              tone="slate"
            />
          </section>

          {salesQuery.data.rows.length === 0 ? (
            <EmptyReportState title="No Report Data Found" description="Belum ada data penjualan pada filter yang dipilih." />
          ) : (
            <>
              <SalesChart data={salesQuery.data.trend} />
              <SalesTable rows={salesQuery.data.rows} />
            </>
          )}
        </div>
      ) : null}

      {!activeQuery.isLoading && !activeQuery.isError && activeTab === 'harvest' && harvestQuery.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Harvest"
              value={formatNumber(harvestQuery.data.summary.total_harvest)}
              description="Total hasil panen dalam satuan ekor pada periode laporan."
              icon={Fish}
            />
            <SummaryCard
              title="Total Weight"
              value={`${formatNumber(harvestQuery.data.summary.total_weight)} kg`}
              description="Akumulasi berat panen yang tercatat dari backend."
              icon={PackageCheck}
              tone="emerald"
            />
            <SummaryCard
              title="Average Survival Rate"
              value={`${harvestQuery.data.summary.average_survival_rate.toFixed(1)}%`}
              description="Rata-rata survival rate dari aktivitas panen yang berhasil dimuat."
              icon={Activity}
              tone="amber"
            />
            <SummaryCard
              title="Harvest Count"
              value={formatNumber(harvestQuery.data.summary.harvest_count)}
              description="Jumlah aktivitas panen pada rentang waktu aktif."
              icon={ClipboardList}
              tone="slate"
            />
          </section>

          {harvestQuery.data.rows.length === 0 ? (
            <EmptyReportState title="No Report Data Found" description="Belum ada data panen pada filter yang dipilih." />
          ) : (
            <>
              <HarvestChart data={harvestQuery.data.trend} />
              <HarvestTable rows={harvestQuery.data.rows} />
            </>
          )}
        </div>
      ) : null}

      {!activeQuery.isLoading && !activeQuery.isError && activeTab === 'inventory' && inventoryQuery.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Inventory"
              value={formatNumber(inventoryQuery.data.summary.total_inventory)}
              description="Jumlah item inventaris yang cocok dengan filter aktif."
              icon={Boxes}
            />
            <SummaryCard
              title="Low Stock Items"
              value={formatNumber(inventoryQuery.data.summary.low_stock_items)}
              description="Item yang stoknya menyentuh atau mendekati batas minimum."
              icon={Activity}
              tone="amber"
            />
            <SummaryCard
              title="Out Of Stock"
              value={formatNumber(inventoryQuery.data.summary.out_of_stock)}
              description="Jumlah item inventaris yang saat ini habis."
              icon={ClipboardList}
              tone="slate"
            />
            <SummaryCard
              title="Inventory Value"
              value={formatCompactCurrency(inventoryQuery.data.summary.inventory_value)}
              description="Estimasi nilai stok berdasarkan relasi produk yang tersedia."
              icon={ReceiptText}
              tone="emerald"
            />
          </section>

          {inventoryQuery.data.rows.length === 0 ? (
            <EmptyReportState title="No Report Data Found" description="Belum ada data inventaris pada filter yang dipilih." />
          ) : (
            <InventoryTable rows={inventoryQuery.data.rows} />
          )}
        </div>
      ) : null}

      {!activeQuery.isLoading && !activeQuery.isError && activeTab === 'feeding' && feedingQuery.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Feed Used"
              value={`${formatNumber(feedingQuery.data.summary.total_feed_used)} kg`}
              description="Akumulasi penggunaan pakan dari laporan backend."
              icon={ClipboardList}
            />
            <SummaryCard
              title="Average Feed Usage"
              value={`${formatNumber(feedingQuery.data.summary.average_feed_usage)} kg`}
              description="Rata-rata penggunaan pakan per aktivitas pemberian pakan."
              icon={Activity}
              tone="emerald"
            />
            <SummaryCard
              title="Most Used Feed"
              value={feedingQuery.data.summary.most_used_feed}
              description="Jenis pakan yang paling banyak digunakan pada periode aktif."
              icon={Fish}
              tone="amber"
            />
            <SummaryCard
              title="Feeding Activities"
              value={formatNumber(feedingQuery.data.summary.feeding_activities)}
              description="Jumlah aktivitas pemberian pakan yang tercatat."
              icon={PackageCheck}
              tone="slate"
            />
          </section>

          {feedingQuery.data.trend.length === 0 ? (
            <EmptyReportState title="No Report Data Found" description="Belum ada data log pakan pada filter yang dipilih." />
          ) : (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_380px]">
              <FeedingChart data={feedingQuery.data.trend} />
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
                  Ringkasan Jenis Pakan
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-900">Distribusi penggunaan</h3>
                <div className="mt-6 space-y-3">
                  {feedingQuery.data.rows.map((row) => (
                    <div
                      key={`${row.batch_code}-${row.feed_type}`}
                      className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{row.feed_type}</p>
                          <p className="mt-1 text-xs text-slate-500">Batch {row.batch_code}</p>
                        </div>
                        <p className="text-sm font-semibold text-cyan-700">
                          {formatNumber(row.total_feed)} kg
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      ) : null}

      {!activeQuery.isLoading && !activeQuery.isError && activeTab === 'fish-batches' && fishBatchQuery.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Batch"
              value={formatNumber(fishBatchQuery.data.summary.total_batch)}
              description="Jumlah batch ikan yang sesuai dengan periode laporan aktif."
              icon={Fish}
            />
            <SummaryCard
              title="Growing Batch"
              value={formatNumber(fishBatchQuery.data.summary.growing_batch)}
              description="Batch yang saat ini berada pada fase pertumbuhan."
              icon={Activity}
              tone="emerald"
            />
            <SummaryCard
              title="Harvested Batch"
              value={formatNumber(fishBatchQuery.data.summary.harvested_batch)}
              description="Batch yang sudah memiliki status dipanen."
              icon={PackageCheck}
              tone="amber"
            />
            <SummaryCard
              title="Average Survival Rate"
              value={`${fishBatchQuery.data.summary.average_survival_rate.toFixed(1)}%`}
              description="Rata-rata survival rate batch berdasarkan kuantitas awal dan saat ini."
              icon={ClipboardList}
              tone="slate"
            />
          </section>

          {fishBatchQuery.data.rows.length === 0 ? (
            <EmptyReportState title="No Report Data Found" description="Belum ada data batch ikan pada filter yang dipilih." />
          ) : (
            <FishBatchTable rows={fishBatchQuery.data.rows} />
          )}
        </div>
      ) : null}

      {!activeQuery.isLoading && !activeQuery.isError && activeTab === 'customers' && customerQuery.data ? (
        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Customers"
              value={formatNumber(customerQuery.data.summary.total_customers)}
              description="Jumlah pelanggan dengan role customer yang ada di backend."
              icon={Users}
            />
            <SummaryCard
              title="Active Customers"
              value={formatNumber(customerQuery.data.summary.active_customers)}
              description="Pelanggan dengan status aktif pada data user admin."
              icon={Activity}
              tone="emerald"
            />
            <SummaryCard
              title="Total Orders"
              value={formatNumber(customerQuery.data.summary.total_orders)}
              description="Total order dari periode aktif yang berhasil dimuat."
              icon={ReceiptText}
              tone="amber"
            />
            <SummaryCard
              title="Average Spending"
              value={formatCompactCurrency(customerQuery.data.summary.average_spending)}
              description="Rata-rata total belanja per pelanggan yang bertransaksi."
              icon={ClipboardList}
              tone="slate"
            />
          </section>

          {customerQuery.data.rows.length === 0 ? (
            <EmptyReportState title="No Report Data Found" description="Belum ada data pelanggan yang memiliki transaksi pada filter ini." />
          ) : (
            <CustomerTable rows={customerQuery.data.rows} />
          )}
        </div>
      ) : null}
    </div>
  )
}

function EmptyReportState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
      <div className="rounded-full bg-slate-100 p-4 text-slate-400">
        <ClipboardList className="size-7" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">{description}</p>
    </section>
  )
}
