import {
  BarChart3,
  Boxes,
  ClipboardList,
  Fish,
  PackageCheck,
  Users,
} from 'lucide-react'
import type { ReportTabKey } from '@/types/report'

type ReportTabsProps = {
  activeTab: ReportTabKey
  onChange: (tab: ReportTabKey) => void
}

const tabs: Array<{ key: ReportTabKey; label: string; icon: typeof BarChart3 }> = [
  { key: 'sales', label: 'Sales Report', icon: BarChart3 },
  { key: 'harvest', label: 'Harvest Report', icon: PackageCheck },
  { key: 'inventory', label: 'Inventory Report', icon: Boxes },
  { key: 'feeding', label: 'Feeding Report', icon: ClipboardList },
  { key: 'fish-batches', label: 'Fish Batch Report', icon: Fish },
  { key: 'customers', label: 'Customer Report', icon: Users },
]

export function ReportTabs({ activeTab, onChange }: ReportTabsProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/40">
      <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.key === activeTab

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                isActive
                  ? 'border-emerald-700/70 bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-1 ring-emerald-200'
                  : 'border-slate-200 bg-slate-50 text-slate-600 shadow-sm shadow-slate-200/40 hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700 hover:ring-1 hover:ring-cyan-100'
              }`}
            >
              <span
                className={`rounded-lg p-2 ${
                  isActive
                    ? 'border border-white/15 bg-white/15 text-white'
                    : 'border border-slate-200 bg-white text-cyan-600'
                }`}
              >
                <Icon className="size-4" />
              </span>
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
