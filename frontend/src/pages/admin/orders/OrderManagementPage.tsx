import {
  AlertCircle,
  DollarSign,
  Package,
  CheckCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { useOrders } from '@/hooks/useOrderManagement'
import { SummaryCard } from '@/components/admin/orders/SummaryCard'
import { RevenueCard } from '@/components/admin/orders/RevenueCard'
import { SearchFilter } from '@/components/admin/orders/SearchFilter'
import { OrderTable } from '@/components/admin/orders/OrderTable'
import { OrderDetailModal } from '@/components/admin/orders/OrderDetailModal'
import { OrderStatusModal } from '@/components/admin/orders/OrderStatusModal'
import { LoadingSkeleton } from '@/components/admin/orders/LoadingSkeleton'
import type { OrderListItem } from '@/types/order-management'

export function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [selectedOrderForStatus, setSelectedOrderForStatus] =
    useState<OrderListItem | null>(null)

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      search: searchQuery || undefined,
      status: statusFilter || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    }),
    [currentPage, searchQuery, statusFilter, dateFrom, dateTo]
  )

  const { data, isLoading, isError, refetch } = useOrders(queryParams)

  const handleRefresh = () => {
    refetch()
  }

  const handleViewDetail = (order: OrderListItem) => {
    setSelectedOrderId(order.id)
  }

  const handleUpdateStatus = (order: OrderListItem) => {
    setSelectedOrderForStatus(order)
  }

  const handleCloseDetailModal = () => {
    setSelectedOrderId(null)
  }

  const handleCloseStatusModal = () => {
    setSelectedOrderForStatus(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pesanan</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola dan monitor semua pesanan pelanggan
          </p>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pesanan</h1>
          <p className="mt-1 text-sm text-slate-600">
            Kelola dan monitor semua pesanan pelanggan
          </p>
        </div>
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white p-12 text-center shadow-lg">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="size-12 text-red-500" />
          </div>
          <h3 className="mt-4 text-xl font-bold text-slate-900">
            Gagal Memuat Data Pesanan
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Terjadi kesalahan saat mengambil data pesanan.
          </p>
          <button
            type="button"
            onClick={handleRefresh}
            className="mt-6 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const orders = data?.orders || []
  const summary = data?.summary
  const meta = data?.meta

  const totalPages = meta?.total_pages || 1

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-900">Manajemen Pesanan</h1>
        <p className="mt-1 text-sm text-emerald-700">
          Kelola dan monitor semua pesanan pelanggan
        </p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            title="Total Pesanan"
            value={summary.total_orders}
            icon={Package}
            colorClass="bg-blue-500"
          />
          <SummaryCard
            title="Pending"
            value={summary.pending_orders}
            icon={Clock}
            colorClass="bg-yellow-500"
          />
          <SummaryCard
            title="Diproses"
            value={summary.processing_orders}
            icon={Loader2}
            colorClass="bg-purple-500"
          />
          <SummaryCard
            title="Selesai"
            value={summary.completed_orders}
            icon={CheckCircle}
            colorClass="bg-green-500"
          />
          <SummaryCard
            title="Total Revenue"
            value={`Rp ${(summary.total_revenue / 1000000).toFixed(1)}M`}
            icon={DollarSign}
            colorClass="bg-emerald-500"
          />
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RevenueCard
            label="Revenue Hari Ini"
            amount={summary.today_revenue}
            colorClass="bg-blue-500"
          />
          <RevenueCard
            label="Revenue Bulan Ini"
            amount={summary.month_revenue}
            colorClass="bg-green-500"
          />
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dateFrom={dateFrom}
          onDateFromChange={setDateFrom}
          dateTo={dateTo}
          onDateToChange={setDateTo}
          onRefresh={handleRefresh}
        />
      </div>

      <OrderTable
        orders={orders}
        onViewDetail={handleViewDetail}
        onUpdateStatus={handleUpdateStatus}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <p className="text-sm text-slate-600">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      <OrderDetailModal
        orderId={selectedOrderId}
        onClose={handleCloseDetailModal}
      />

      <OrderStatusModal
        order={selectedOrderForStatus}
        onClose={handleCloseStatusModal}
      />
    </div>
  )
}
