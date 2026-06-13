import {
  Fish,
  LayoutGrid,
  ShoppingCart,
  Sprout,
  Tractor,
} from 'lucide-react'

const steps = [
  {
    icon: LayoutGrid,
    title: 'Pond',
    description: 'Kolam dipetakan dengan parameter kualitas air dan kapasitas budidaya.',
  },
  {
    icon: Fish,
    title: 'Fish Batch',
    description: 'Batch ikan tercatat sejak tebar benih dengan identitas digital yang jelas.',
  },
  {
    icon: Sprout,
    title: 'Feeding',
    description: 'Jadwal pakan, pertumbuhan, dan kesehatan dipantau secara terstruktur.',
  },
  {
    icon: Tractor,
    title: 'Harvest',
    description: 'Panen dilakukan tepat waktu dengan pencatatan kualitas dan volume hasil.',
  },
  {
    icon: ShoppingCart,
    title: 'Marketplace',
    description: 'Produk masuk ke etalase digital dengan stok, harga, dan traceability siap jual.',
  },
]

export function ProcessSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-blue-600 uppercase">
            Proses Budidaya
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Satu alur kerja terhubung dari pemantauan kolam hingga pengiriman ke marketplace
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <article key={title} className="relative">
              {index < steps.length - 1 ? (
                <div className="absolute left-7 top-16 hidden h-px w-[calc(100%-1rem)] bg-gradient-to-r from-blue-300 to-green-300 lg:block" />
              ) : null}
              <div className="relative h-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:border-blue-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
                  Tahap {index + 1}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
