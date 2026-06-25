import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { StaffFishBatchStatusPoint } from '@/types/staff-dashboard'
import { formatNumber } from '@/utils/format'

interface FishBatchStatusChartProps {
  data: StaffFishBatchStatusPoint[]
}

const chartColors = ['#38bdf8', '#8b5cf6', '#10b981', '#f97316']

export function FishBatchStatusChart({ data }: FishBatchStatusChartProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-600">
          Fish Batch Status
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Komposisi status batch</h2>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_200px] lg:items-center">
        <div className="h-72">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
              No Data Available
            </div>
          )}
        </div>

        <div className="space-y-3">
          {data.length > 0 ? (
            data.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span className="text-sm font-medium text-slate-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-slate-950">
                  {formatNumber(item.value)}
                </span>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-medium text-slate-500">
              No Data Available
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
