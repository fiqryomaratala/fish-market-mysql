import { Leaf, Shield, Waves } from 'lucide-react'

const aboutCards = [
  {
    icon: Leaf,
    title: 'Budidaya Berkelanjutan',
    description:
      'Budidaya modern kami mengutamakan keseimbangan ekosistem kolam, manajemen pakan efisien, dan panen yang bertanggung jawab.',
  },
  {
    icon: Shield,
    title: 'Kontrol Operasional',
    description:
      'Setiap batch diawasi melalui pencatatan mutu air, kesehatan ikan, dan standar keamanan pangan yang konsisten.',
  },
  {
    icon: Waves,
    title: 'Rantai Pasok Terhubung',
    description:
      'Data budidaya, hasil panen, dan distribusi pasar terhubung sehingga pembeli mendapatkan visibilitas penuh dari farm hingga checkout.',
  },
]

export function AboutSection() {
  return (
    <section id="about" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="inline-flex rounded-lg border border-green-100 bg-green-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-green-700 uppercase">
            Tentang Farm Kami
          </span>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Tentang Farm Kami
          </h2>
          <p className="text-base leading-8 text-slate-500">
            Kami membangun ekosistem budidaya ikan modern yang memadukan praktik
            aquaculture berkelanjutan, pencatatan batch digital, dan pengalaman
            marketplace yang siap skala seperti produk SaaS premium.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {aboutCards.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
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
