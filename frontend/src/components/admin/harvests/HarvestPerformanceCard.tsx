import { Banknote, Scale, TrendingUp } from 'lucide-react'
import { formatCompactCurrency, formatNumber } from '@/utils/format'

type HarvestPerformanceCardProps = {
  totalWeight: number
  survivalRate: number
  estimatedRevenue?: number
}

export function HarvestPerformanceCard({
  totalWeight,
  survivalRate,
  estimatedRevenue,
}: HarvestPerformanceCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
          Harvest Performance
        </p>
        <h2 className="text-xl font-semibold text-slate-900">Performa panen terpilih</h2>
        <p className="text-sm text-slate-500">
          Ringkasan cepat bobot total, survival rate, dan estimasi nilai hasil panen.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-cyan-700">
              <Scale className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Weight</p>
              <p className="text-lg font-semibold text-slate-900">{formatNumber(totalWeight)} kg</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-emerald-700">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Survival Rate</p>
              <p className="text-lg font-semibold text-slate-900">{survivalRate.toFixed(1)}%</p>
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 text-purple-700">
              <Banknote className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Estimasi Revenue</p>
              <p className="text-lg font-semibold text-slate-900">
                {estimatedRevenue ? formatCompactCurrency(estimatedRevenue) : '-'}
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

