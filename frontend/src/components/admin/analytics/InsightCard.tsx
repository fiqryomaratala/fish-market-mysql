// Komponen Insight Card untuk Analytics Dashboard
import { DollarSign, Fish, Activity, Package, Users, TrendingUp } from 'lucide-react'
import { formatCompactCurrency, formatNumber } from '@/utils/format'

type InsightCardProps = {
  title: string
  description: string
  value: React.ReactNode
  icon: React.ElementType
  tone?: 'cyan' | 'emerald' | 'amber' | 'slate' | 'rose'
  subtext?: string
}

export function InsightCard({ 
  title, 
  description, 
  value, 
  icon: Icon, 
  tone = 'cyan',
  subtext 
}: InsightCardProps) {
  const toneClasses = {
    cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
    slate: 'text-slate-600 bg-slate-50 border-slate-200',
    rose: 'text-rose-600 bg-rose-50 border-rose-200',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-300/50">
      <div className="flex items-start gap-4">
        <div className={`rounded-xl border p-3 ${toneClasses[tone]}`}>
          <Icon className="size-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              {title}
            </p>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              <TrendingUp className="size-3" />
              <span>Insight</span>
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          {subtext && (
            <div className="mt-2 text-xs text-slate-500">{subtext}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export function InsightSection({ data }: { data: any }) {
  if (!data) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <InsightCard
        title="Top Revenue Product"
        value={data.top_revenue_product?.name || 'Tidak ada data'}
        description="Produk dengan pendapatan tertinggi"
        icon={DollarSign}
        tone="emerald"
        subtext={data.top_revenue_product?.revenue ? formatCompactCurrency(data.top_revenue_product.revenue) : ''}
      />
      <InsightCard
        title="Most Productive Pond"
        value={data.most_productive_pond?.name || 'Tidak ada data'}
        description="Kolam dengan hasil panen terbesar"
        icon={Fish}
        tone="cyan"
        subtext={data.most_productive_pond?.harvest_weight ? `${formatNumber(data.most_productive_pond.harvest_weight)} kg` : ''}
      />
      <InsightCard
        title="Best Survival Rate Batch"
        value={data.best_survival_rate_batch?.batch_code || 'Tidak ada data'}
        description="Batch dengan survival rate terbaik"
        icon={Activity}
        tone="amber"
        subtext={data.best_survival_rate_batch?.survival_rate ? `${(data.best_survival_rate_batch.survival_rate * 100).toFixed(1)}%` : ''}
      />
      <InsightCard
        title="Most Used Feed"
        value={data.most_used_feed?.feed_type || 'Tidak ada data'}
        description="Jenis pakan paling banyak digunakan"
        icon={Package}
        tone="slate"
        subtext={data.most_used_feed?.total_used ? `${formatNumber(data.most_used_feed.total_used)} kg` : ''}
      />
      <InsightCard
        title="Most Active Customer"
        value={data.most_active_customer?.name || 'Tidak ada data'}
        description="Pelanggan paling aktif bertransaksi"
        icon={Users}
        tone="rose"
        subtext={data.most_active_customer?.total_orders ? `${formatNumber(data.most_active_customer.total_orders)} orders` : ''}
      />
    </div>
  )
}