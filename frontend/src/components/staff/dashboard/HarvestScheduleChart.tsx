import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { StaffHarvestSchedulePoint } from '@/types/staff-dashboard'

interface HarvestScheduleChartProps {
  data: StaffHarvestSchedulePoint[]
}

export function HarvestScheduleChart({ data }: HarvestScheduleChartProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Harvest Schedule
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Panen per minggu</h2>
        </div>
      </div>

      <div className="mt-6 h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={34}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="total" radius={[12, 12, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
            No Data Available
          </div>
        )}
      </div>
    </section>
  )
}
