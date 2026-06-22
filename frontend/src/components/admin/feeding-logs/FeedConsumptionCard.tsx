type FeedConsumptionCardProps = {
  totalFeedUsed: string
  averageFeedPerDay: string
  mostUsedFeed: string
}

export function FeedConsumptionCard({
  totalFeedUsed,
  averageFeedPerDay,
  mostUsedFeed,
}: FeedConsumptionCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Statistik Konsumsi Pakan
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Ringkasan konsumsi pakan</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Pantau pola pemakaian pakan untuk membantu keputusan operasional harian.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Total Feed Used</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{totalFeedUsed}</p>
          <p className="mt-2 text-sm text-slate-500">Akumulasi jumlah pakan dari data log yang dimuat.</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Average Feed Per Day
          </p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{averageFeedPerDay}</p>
          <p className="mt-2 text-sm text-slate-500">Rata-rata konsumsi pakan per hari berdasarkan periode data.</p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Most Used Feed</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900">{mostUsedFeed}</p>
          <p className="mt-2 text-sm text-slate-500">Jenis pakan yang paling sering tercatat pada feeding log.</p>
        </article>
      </div>
    </section>
  )
}
