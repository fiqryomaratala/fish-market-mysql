import type { StaffInventoryAlert } from '@/types/staff-dashboard'
import { formatNumber } from '@/utils/format'

interface InventoryAlertTableProps {
  items: StaffInventoryAlert[]
}

function getStatusClass(status: string) {
  if (status === 'Out Of Stock') {
    return 'bg-rose-100 text-rose-700'
  }

  return 'bg-amber-100 text-amber-700'
}

export function InventoryAlertTable({ items }: InventoryAlertTableProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-600">
          Inventory Alert
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Peringatan stok pakan</h2>
      </div>

      <div className="mt-6 overflow-x-auto">
        {items.length > 0 ? (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-3 font-semibold">Feed Name</th>
                <th className="px-4 py-3 font-semibold">Current Stock</th>
                <th className="px-4 py-3 font-semibold">Minimum Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{item.feed_name}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatNumber(item.current_stock)}
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatNumber(item.minimum_stock)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm font-medium text-slate-500">
            No Data Available
          </div>
        )}
      </div>
    </section>
  )
}
