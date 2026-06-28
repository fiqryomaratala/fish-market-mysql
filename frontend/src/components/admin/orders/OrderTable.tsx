import { Package } from 'lucide-react'
import type { OrderListItem } from '@/types/order-management'
import { OrderRow } from './OrderRow'

interface OrderTableProps {
  orders: OrderListItem[]
  onViewDetail: (order: OrderListItem) => void
  onUpdateStatus: (order: OrderListItem) => void
}

export function OrderTable({
  orders,
  onViewDetail,
  onUpdateStatus,
}: OrderTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center shadow-lg">
        <div className="rounded-full bg-slate-100 p-6">
          <Package className="size-12 text-slate-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">
          Tidak Ada Pesanan
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Belum ada pesanan yang tersedia saat ini.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Invoice
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Customer
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase text-slate-700">
                Total Item
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Total Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Payment Method
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onViewDetail={onViewDetail}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
