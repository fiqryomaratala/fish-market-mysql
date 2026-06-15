import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OrderCard } from '@/components/orders/OrderCard'
import {
  OrderFilter,
  type OrderFilterStatus,
  type OrderSortOption,
} from '@/components/orders/OrderFilter'
import { OrderPagination } from '@/components/orders/OrderPagination'
import { LoadingSkeleton } from '@/components/orders/LoadingSkeleton'
import { EmptyState } from '@/components/orders/EmptyState'
import { ErrorState } from '@/components/orders/ErrorState'
import { useOrders } from '@/hooks/useOrders'
import type { Order } from '@/types/order'

const PAGE_SIZE = 5

function sortOrders(orders: Order[], sort: OrderSortOption) {
  return [...orders].sort((left, right) => {
    if (sort === 'Oldest') {
      return new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
    }

    if (sort === 'Highest Total') {
      return right.total - left.total
    }

    if (sort === 'Lowest Total') {
      return left.total - right.total
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  })
}

function OrderHistoryPage() {
  const navigate = useNavigate()
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<OrderFilterStatus>('All')
  const [sort, setSort] = useState<OrderSortOption>('Newest')
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, isFetching, error, refetch } = useOrders({
    page: 1,
    limit: 100,
  })

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim())
      setCurrentPage(1)
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const filteredOrders = useMemo(() => {
    const orders = data?.orders ?? []
    const normalizedSearch = search.toLowerCase()

    const result = orders.filter((order) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        order.invoice_number.toLowerCase().includes(normalizedSearch) ||
        order.shipping_name.toLowerCase().includes(normalizedSearch) ||
        order.shipping_address.toLowerCase().includes(normalizedSearch)
      const matchesStatus = status === 'All' || order.status === status

      return matchesSearch && matchesStatus
    })

    return sortOrders(result, sort)
  }, [data?.orders, search, sort, status])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedOrders = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredOrders, safeCurrentPage])

  const handleReset = () => {
    setSearchInput('')
    setSearch('')
    setStatus('All')
    setSort('Newest')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_26%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_54%,_#ecfeff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
            Order History
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-5xl">
            Pantau seluruh pesanan Anda dalam satu dashboard yang rapi.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Histori transaksi ditampilkan langsung dari backend API dengan filter cepat,
            status badge yang jelas, dan layout yang nyaman di desktop maupun mobile.
          </p>
        </div>
      </section>

      <OrderFilter
        search={searchInput}
        status={status}
        sort={sort}
        onSearchChange={setSearchInput}
        onStatusChange={(value) => {
          setStatus(value)
          setCurrentPage(1)
        }}
        onSortChange={(value) => {
          setSort(value)
          setCurrentPage(1)
        }}
        onReset={handleReset}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Menampilkan <span className="font-semibold text-slate-900">{filteredOrders.length}</span>{' '}
          order
        </p>
        <p className="text-sm text-slate-500">
          Backend total: <span className="font-semibold text-emerald-600">{data?.meta.total ?? 0}</span>
          {isFetching && !isLoading ? ' • syncing...' : ''}
        </p>
      </div>

      {isLoading ? <LoadingSkeleton /> : null}

      {!isLoading && error ? <ErrorState onRetry={() => void refetch()} /> : null}

      {!isLoading && !error && filteredOrders.length === 0 ? (
        <EmptyState onStartShopping={() => navigate('/products')} />
      ) : null}

      {!isLoading && !error && filteredOrders.length > 0 ? (
        <>
          <section className="space-y-5">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetail={(orderId) => navigate(`/orders/${orderId}`)}
              />
            ))}
          </section>

          <OrderPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : null}
    </div>
  )
}

export default OrderHistoryPage
