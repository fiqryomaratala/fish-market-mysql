import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Rina Saputra',
    role: 'Pemilik Restoran',
    review:
      'Kualitas ikan selalu konsisten, dan fitur tracking batch membuat kami jauh lebih percaya diri saat menjelaskan asal produk ke pelanggan.',
  },
  {
    name: 'Arif Hidayat',
    role: 'Pembeli Grosir',
    review:
      'Dashboard marketplace dan informasi stok panen terasa seperti platform premium. Proses pemesanan jadi cepat dan transparan.',
  },
  {
    name: 'Maya Lestari',
    role: 'Distributor Seafood',
    review:
      'Tim kami terbantu dengan visibilitas panen dan kesiapan pengiriman. Informasi dari farm ke pasar sangat jelas dan meyakinkan.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Dipercaya oleh pembeli ikan, distributor, dan tim hospitality
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="landing-blue-icon flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
                <Quote className="h-5 w-5 text-slate-300" />
              </div>
              <div className="mt-6 flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star key={`${testimonial.name}-${starIndex}`} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-500">
                {testimonial.review}
              </p>
              <p className="landing-blue-text mt-5 text-xs font-semibold tracking-[0.18em] uppercase">
                Klien #{index + 1}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
