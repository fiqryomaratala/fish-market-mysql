// Komponen KPI Card untuk Analytics Dashboard
import { DollarSign, ShoppingBag, Users, Fish, Activity, Package } from 'lucide-react'
import { formatCompactCurrency, formatNumber } from '@/utils/format'

type KpiCardProps = {
  title: string
  value: string
  description: string
  icon: React.ElementType
  tone?: 'cyan' | 'emerald' | 'amber' | 'slate'
}

export function KpiCard({ title, value, description, icon: Icon, tone = 'cyan' }: KpiCardProps) {
  const toneClasses = {
    cyan: 'text-cyan-600 bg-cyan-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    slate: 'text-slate-600 bg-slate-50',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-300/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-2 ${toneClasses[tone]}`}>
              <Icon className="size-5" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              {title}
            </p>
          </div>
          <h3 className="mt-4 text-3xl font-bold text-slate-900">{value}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function KpiSection({ data }: { data: any }) {
  if (!data) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        title="Total Revenue"
        value={formatCompactCurrency(data.total_revenue || 0)}
        description="Akumulasi pendapatan dari semua transaksi"
        icon={DollarSign}
        tone="emerald"
      />
      <KpiCard
        title="Total Orders"
        value={formatNumber(data.total_orders || 0)}
        description="Jumlah pesanan yang tercatat"
        icon={ShoppingBag}
        tone="cyan"
      />
      <KpiCard
        title="Total Customers"
        value={formatNumber(data.total_customers || 0)}
        description="Jumlah pelanggan aktif"
        icon={Users}
        tone="amber"
      />
      <KpiCard
        title="Harvest Weight"
        value={`${formatNumber(data.total_harvest_weight || 0)} kg`}
        description="Total berat panen keseluruhan"
        icon={Fish}
        tone="slate"
      />
      <KpiCard
        title="Avg Survival Rate"
        value={`${((data.average_survival_rate || 0) * 100).toFixed(1)}%`}
        description="Rata-rata tingkat kelangsungan hidup"
        icon={Activity}
        tone="cyan"
      />
      <KpiCard
        title="Total Feed Used"
        value={`${formatNumber(data.total_feed_used || 0)} kg`}
        description="Total pakan yang digunakan"
        icon={Package}
        tone="emerald"
      />
    </div>
  )
}