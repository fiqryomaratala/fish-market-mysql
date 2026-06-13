import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'

function HomePage() {
  usePageTitle('Home')

  return (
    <section className="grid gap-10 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">
          Fish Marketplace & Aquaculture
        </p>
        <div className="space-y-4">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Frontend foundation for a scalable fish commerce and farm operations
            platform.
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Struktur ini memisahkan route publik, auth, customer, dan admin,
            lalu menyiapkan folder `api`, `services`, `store`, dan `types`
            untuk kebutuhan production-ready React app.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/products"
            className="rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
          >
            Explore Products
          </Link>
          <Link
            to="/admin"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Open Admin Area
          </Link>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 p-5">
            <p className="text-sm text-cyan-100">Routing strategy</p>
            <p className="mt-3 text-2xl font-semibold text-white">Lazy loaded</p>
          </div>
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
            <p className="text-sm text-emerald-100">Layout system</p>
            <p className="mt-3 text-2xl font-semibold text-white">4 role flows</p>
          </div>
          <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-5">
            <p className="text-sm text-sky-100">Tooling</p>
            <p className="mt-3 text-2xl font-semibold text-white">Vite + TS</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">Ready for</p>
            <p className="mt-3 text-2xl font-semibold text-white">Gin REST API</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
