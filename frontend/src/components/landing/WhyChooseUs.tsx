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
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-green-700 uppercase">
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
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:bg-gradient-to-br hover:from-blue-50 hover:to-green-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-blue-600 shadow-lg shadow-slate-100 transition duration-300 group-hover:scale-110 group-hover:bg-blue-50">
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
