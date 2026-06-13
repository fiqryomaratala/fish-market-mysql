const statistics = [
  { value: '500+', label: 'Batch Ikan' },
  { value: '100+', label: 'Kolam' },
  { value: '5000+', label: 'Pesanan' },
  { value: '99%', label: 'Kepuasan Pelanggan' },
]

export function StatisticsSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statistics.map((item) => (
          <article
            key={item.label}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:border-blue-200"
          >
            <p className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              {item.value}
            </p>
            <p className="mt-4 text-sm font-medium tracking-[0.2em] text-slate-500 uppercase">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
