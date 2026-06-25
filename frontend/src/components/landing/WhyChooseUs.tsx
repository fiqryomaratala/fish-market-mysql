import {
  BadgeCheck,
  Fish,
  ShieldCheck,
  Truck,
} from 'lucide-react'

const reasons = [
  {
    icon: Fish,
    title: 'Panen Segar',
    description:
      'Produk langsung dipanen dari kolam terpilih untuk menjaga rasa, tekstur, dan kualitas terbaik.',
  },
  {
    icon: BadgeCheck,
    title: 'Kualitas Tersertifikasi',
    description:
      'Setiap batch mengikuti standar inspeksi mutu, sanitasi, dan pencatatan produksi yang rapi.',
  },
  {
    icon: Truck,
    title: 'Pengiriman Cepat',
    description:
      'Proses pemenuhan pesanan cepat dengan koordinasi stok dan logistik yang terintegrasi dari farm ke pelanggan.',
  },
  {
    icon: ShieldCheck,
    title: 'Pelacakan Transparan',
    description:
      'Pembeli dapat melacak asal batch, histori pakan, dan tahapan distribusi secara jelas.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-blue-700 uppercase">
            Kenapa Memilih Kami
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Dibangun untuk kepercayaan, keterlacakan, dan perdagangan ikan premium
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-700 transition duration-200 group-hover:bg-green-100">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
