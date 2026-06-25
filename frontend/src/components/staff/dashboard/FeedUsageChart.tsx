import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { StaffFeedUsagePoint } from '@/types/staff-dashboard'

interface FeedUsageChartProps {
  data: StaffFeedUsagePoint[]
}

export function FeedUsageChart({ data }: FeedUsageChartProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-600">
          Feed Usage Trend
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Penggunaan pakan 7 hari</h2>
      </div>

      <div className="mt-6 h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
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
