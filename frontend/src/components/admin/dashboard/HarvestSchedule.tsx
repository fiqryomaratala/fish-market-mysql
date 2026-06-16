import { CalendarClock } from 'lucide-react'
import type { HarvestScheduleItem as HarvestScheduleRow } from '@/types/dashboard'
import { formatDate } from '@/utils/format'

type HarvestScheduleProps = {
  items: HarvestScheduleRow[]
}

const statusClassMap: Record<string, string> = {
  Active: 'bg-cyan-100 text-cyan-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
}

export function HarvestSchedule({ items }: HarvestScheduleProps) {
  return (
    <section className="rounded-xl border border-white/60 bg-white/72 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Harvest Schedule
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Jadwal Panen</h2>
        </div>
        <span className="flex size-12 items-center justify-center rounded-xl bg-cyan-600 text-white">
          <CalendarClock className="size-5" />
        </span>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <article key={`${item.batch_code}-${item.harvest_date}`} className="rounded-xl bg-slate-50/90 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.batch_code}</p>
                <p className="mt-1 text-sm text-slate-500">{item.pond}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  statusClassMap[item.status] ?? 'bg-slate-200 text-slate-600'
                }`}
              >
                {item.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-700">{formatDate(item.harvest_date)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
