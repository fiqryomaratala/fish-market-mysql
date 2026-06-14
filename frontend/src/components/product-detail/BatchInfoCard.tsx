import {
  CalendarDays,
  CircleDot,
  Fish,
  MapPin,
  PackageSearch,
  ScanSearch,
} from 'lucide-react'
import type { Product } from '@/types/product'

type BatchInfoCardProps = {
  product: Product
  formattedHarvestDate: string
}

const batchItems = [
  { key: 'batch_code', label: 'Batch Code', icon: ScanSearch },
  { key: 'farm_name', label: 'Farm Name', icon: Fish },
  { key: 'pond_name', label: 'Pond Name', icon: MapPin },
  { key: 'harvest_date', label: 'Harvest Date', icon: CalendarDays },
  { key: 'weight', label: 'Weight', icon: PackageSearch },
  { key: 'status', label: 'Status', icon: CircleDot },
] as const

export function BatchInfoCard({ product, formattedHarvestDate }: BatchInfoCardProps) {
  const values = {
    batch_code: product.batch_code || '-',
    farm_name: product.farm_name || '-',
    pond_name: product.pond_name || '-',
    harvest_date: formattedHarvestDate,
    weight: product.weight || '-',
    status: product.status || '-',
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <PackageSearch className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Fish Batch Information</h2>
          <p className="text-sm text-slate-500">Traceability ringkas untuk batch panen ini.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {batchItems.map(({ key, label, icon: Icon }) => (
          <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3 text-slate-500">
              <Icon className="size-4 text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">{values[key]}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
