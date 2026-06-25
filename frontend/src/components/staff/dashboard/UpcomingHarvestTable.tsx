import type { StaffUpcomingHarvest } from '@/types/staff-dashboard'
import { formatDate } from '@/utils/format'

interface UpcomingHarvestTableProps {
  items: StaffUpcomingHarvest[]
}

function formatDaysRemaining(value?: number) {
  if (value === undefined) {
    return '-'
  }

  if (value < 0) {
    return `${Math.abs(value)} hari lewat`
  }

  if (value === 0) {
    return 'Hari ini'
  }

  return `${value} hari`
}

export function UpcomingHarvestTable({ items }: UpcomingHarvestTableProps) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
          Upcoming Harvest
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Jadwal panen mendatang</h2>
      </div>

      <div className="mt-6 overflow-x-auto">
        {items.length > 0 ? (
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.18em] text-slate-500">
                <th className="px-4 py-3 font-semibold">Batch Code</th>
                <th className="px-4 py-3 font-semibold">Fish Type</th>
                <th className="px-4 py-3 font-semibold">Pond</th>
                <th className="px-4 py-3 font-semibold">Harvest Date</th>
                <th className="px-4 py-3 font-semibold">Days Remaining</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-4 text-sm font-semibold text-slate-900">{item.batch_code}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.fish_type}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.pond}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatDate(item.harvest_date)}
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    {formatDaysRemaining(item.days_remaining)}
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
