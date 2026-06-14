import { useState } from 'react'
import { CalendarDays, MapPinned, ScrollText, Warehouse } from 'lucide-react'
import type { Product } from '@/types/product'

type ProductTabsProps = {
  product: Product
  formattedHarvestDate: string
}

const tabs = [
  { id: 'description', label: 'Description', icon: ScrollText },
  { id: 'specification', label: 'Specification', icon: CalendarDays },
  { id: 'farm-information', label: 'Farm Information', icon: Warehouse },
] as const

type TabId = (typeof tabs)[number]['id']

export function ProductTabs({ product, formattedHarvestDate }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description')

  const categoryName = product.category || 'kategori belum tersedia'
  const farmLocation = product.farm_name
    ? `${product.farm_name}, sentra budidaya ${categoryName.toLowerCase()}`
    : '-'

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = id === activeTab

          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Icon className="size-4" />
              {label}
            </button>
          )
        })}
      </div>

      {activeTab === 'description' ? (
        <div className="pt-5">
          <p className="text-sm leading-8 text-slate-600">
            {product.description || 'Deskripsi produk belum tersedia.'}
          </p>
        </div>
      ) : null}

      {activeTab === 'specification' ? (
        <div className="grid gap-4 pt-5 md:grid-cols-2 xl:grid-cols-5">
          {[
            { label: 'Species', value: product.name },
            { label: 'Weight', value: product.weight || '-' },
            { label: 'Harvest Date', value: formattedHarvestDate },
            { label: 'Stock', value: `${product.stock} item` },
            { label: 'Batch Code', value: product.batch_code || '-' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === 'farm-information' ? (
        <div className="grid gap-4 pt-5 md:grid-cols-2">
          {[
            { label: 'Nama Budidaya', value: product.farm_name },
            { label: 'Lokasi', value: farmLocation },
            { label: 'Kolam', value: product.pond_name || '-' },
            { label: 'Kategori', value: categoryName || '-' },
            {
              label: 'Deskripsi',
              value: product.description || 'Informasi budidaya belum tersedia dari API.',
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${
                item.label === 'Deskripsi' ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPinned className="size-4 text-blue-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {item.label}
                </p>
              </div>
              <p className="mt-3 text-sm leading-7 font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
