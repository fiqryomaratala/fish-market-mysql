import type { InventoryMovement } from '@/types/inventory'
import {
  getInventoryMovementClasses,
  getInventoryMovementLabel,
} from '@/types/inventory'
import { formatDate, formatNumber } from '@/utils/format'

type InventoryMovementTableProps = {
  movements: InventoryMovement[]
}

export function InventoryMovementTable({ movements }: InventoryMovementTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Pergerakan Stok
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">Riwayat pergerakan inventaris</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Inventory Item</th>
              <th className="px-5 py-4">Movement Type</th>
              <th className="px-5 py-4">Quantity</th>
              <th className="px-5 py-4">Reason</th>
              <th className="px-5 py-4">Created By</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement) => (
              <tr key={movement.id} className="border-b border-slate-100 last:border-b-0">
                <td className="px-5 py-4 text-sm text-slate-600">{formatDate(movement.date)}</td>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-slate-900">{movement.item}</p>
                  <p className="mt-1 text-xs text-slate-500">{movement.reference || 'Tanpa referensi'}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${getInventoryMovementClasses(movement.movement_type)}`}
                  >
                    {getInventoryMovementLabel(movement.movement_type)}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                  {formatNumber(movement.quantity)}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {movement.reason || 'Tanpa keterangan'}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {movement.created_by || 'Sistem'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
