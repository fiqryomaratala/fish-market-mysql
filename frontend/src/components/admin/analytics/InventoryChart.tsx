// Komponen Inventory Chart untuk Analytics Dashboard
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { InventoryTrendPoint } from '@/types/analytics'
import { formatDate, formatNumber, formatCompactCurrency } from '@/utils/format'

type InventoryChartProps = {
  data: InventoryTrendPoint[]
}

export function InventoryChart({ data }: InventoryChartProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Inventory Trend
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Trend inventaris</h3>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          {formatNumber(data[data.length - 1]?.total_inventory || 0)} item
        </div>
      </div>

      <div className="mt-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatDate(value, { day: '2-digit', month: 'short' })}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatNumber(Number(value))}
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '16px',
                border: '1px solid #cbd5e1',
                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.08)',
              }}
              labelFormatter={(value) => formatDate(value, { day: '2-digit', month: 'long', year: 'numeric' })}
              formatter={(value, name) => {
                if (name === 'total_inventory') return [formatNumber(Number(value)), 'Total Inventaris']
                if (name === 'inventory_value') return [formatCompactCurrency(Number(value)), 'Nilai Inventaris']
                if (name === 'low_stock_items') return [formatNumber(Number(value)), 'Item Stok Rendah']
                return [formatNumber(Number(value)), 'Habis']
              }}
            />
            <Area
              type="monotone"
              dataKey="total_inventory"
              stroke="#0891b2"
              fill="#0891b2"
              fillOpacity={0.1}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="inventory_value"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}