const steps = [
  {
    title: 'Pond',
    titleClassName: '',
    description: 'Kolam dipetakan dengan parameter kualitas air dan kapasitas budidaya.',
  },
  {
    title: 'Fish Batch',
    titleClassName: 'whitespace-nowrap text-[1.55rem] lg:text-[1.65rem]',
    description: 'Batch ikan tercatat sejak tebar benih dengan identitas digital yang jelas.',
  },
  {
    title: 'Feeding',
    titleClassName: '',
    description: 'Jadwal pakan, pertumbuhan, dan kesehatan dipantau secara terstruktur.',
  },
  {
    title: 'Harvest',
    titleClassName: '',
    description: 'Panen dilakukan tepat waktu dengan pencatatan kualitas dan volume hasil.',
  },
  {
    title: 'Marketplace',
    titleClassName: '',
    description: 'Produk masuk ke etalase digital dengan stok, harga, dan traceability siap jual.',
  },
]

export function ProcessSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Satu alur kerja terhubung dari pemantauan kolam hingga pengiriman ke marketplace
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {steps.map(({ title, titleClassName, description }, index) => (
            <article
              key={title}
              className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="landing-blue-band flex min-h-32 items-start px-5 py-5 text-white lg:min-h-36">
                <h3 className={`max-w-[7rem] text-[1.8rem] font-semibold leading-tight lg:max-w-[8rem] ${titleClassName}`}>
                  {title}
                </h3>
              </div>

              <div className="space-y-4 px-5 py-5">
                <p className="landing-blue-text text-sm font-semibold tracking-[0.04em]">
                  Tahap {index + 1}
                </p>
                <p className="text-sm leading-7 text-slate-500">
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
