import { ArrowRight, ScanLine } from 'lucide-react'
import { Link } from 'react-router-dom'

type TrackingCardProps = {
  batchCode: string
}

export function TrackingCard({ batchCode }: TrackingCardProps) {
  if (!batchCode) {
    return null
  }

  return (
    <section className="overflow-hidden rounded-xl bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.32),_transparent_24%),linear-gradient(135deg,_#0f172a_0%,_#1d4ed8_52%,_#0f766e_100%)] p-6 text-white shadow-lg shadow-blue-200/70">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100">
            Supply Traceability
          </div>
          <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Track this Fish Batch</h2>
          <p className="mt-3 text-sm leading-7 text-blue-50/90">
            Buka detail tracking batch untuk melihat identitas panen, asal budidaya, dan alur
            distribusi produk secara cepat.
          </p>
        </div>

        <Link
          to={`/tracking/${batchCode}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
        >
          <ScanLine className="size-4" />
          Track Now
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
