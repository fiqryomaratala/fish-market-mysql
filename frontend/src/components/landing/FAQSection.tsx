import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'Apakah semua produk berasal dari farm sendiri?',
    answer:
      'Ya, landing page ini mensimulasikan marketplace yang terhubung dengan budidaya internal dan mitra aquaculture yang terverifikasi.',
  },
  {
    question: 'Bagaimana sistem tracking batch bekerja?',
    answer:
      'Setiap batch memiliki kode unik yang menghubungkan data kolam, histori pakan, waktu panen, dan status distribusi produk.',
  },
  {
    question: 'Apakah stok diperbarui secara realtime?',
    answer:
      'Data pada landing page masih dummy, tetapi desain ini menyiapkan area stok dan status panen agar mudah dihubungkan ke backend nanti.',
  },
  {
    question: 'Apakah marketplace mendukung pemesanan grosir?',
    answer:
      'Bisa. Struktur produk dan CTA dirancang agar cocok untuk pembeli retail maupun grosir dengan kebutuhan volume berbeda.',
  },
  {
    question: 'Bisakah fitur ini dikembangkan menjadi dashboard operasional?',
    answer:
      'Tentu. Section proses, statistik, dan tracking sengaja dibuat konsisten dengan use case dashboard aquaculture management.',
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex

            return (
              <article
                key={faq.question}
                className="rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="text-base font-semibold text-slate-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`landing-blue-text h-5 w-5 flex-none transition duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen ? (
                  <div className="px-6 pb-6 text-sm leading-7 text-slate-500">
                    {faq.answer}
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
