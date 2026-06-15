import { CircleCheckBig, Clock3, ReceiptText, Wallet } from 'lucide-react'
import type { DashboardSummary } from '@/types/dashboard'

type StatisticsCardProps = {
  summary: DashboardSummary
}

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const stats = [
  {
    key: 'total_orders',
    label: 'Total Orders',
    icon: ReceiptText,
    tone: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'completed_orders',
    label: 'Completed Orders',
    icon: CircleCheckBig,
    tone: 'bg-emerald-50 text-emerald-600',
  },
  {
    key: 'pending_orders',
    label: 'Pending Orders',
    icon: Clock3,
    tone: 'bg-amber-50 text-amber-600',
  },
  {
    key: 'total_spending',
    label: 'Total Spending',
    icon: Wallet,
    tone: 'bg-cyan-50 text-cyan-600',
  },
] as const

export function StatisticsCard({ summary }: StatisticsCardProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const value =
          stat.key === 'total_spending'
            ? currencyFormatter.format(summary.total_spending)
            : summary[stat.key].toLocaleString('id-ID')

        return (
          <article
            key={stat.key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/60"
          >
            <div className={`inline-flex rounded-xl p-3 ${stat.tone}`}>
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          </article>
        )
      })}
    </section>
  )
}
