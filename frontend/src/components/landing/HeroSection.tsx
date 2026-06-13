import {
  ArrowRight,
  BadgeCheck,
  Fish,
  MapPinned,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react'

const featureBadges = [
  'Panen ikan air tawar premium',
  'Transparansi batch secara real-time',
  'Logistik andal dari farm ke pelanggan',
]

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(22,163,74,0.12),_transparent_26%)]" />
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-600 shadow-lg shadow-blue-100">
            <BadgeCheck className="h-4 w-4" />
            Budidaya berkelanjutan untuk perdagangan hasil perikanan modern
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Ikan Segar Langsung Dari Farm Berkelanjutan
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Ikan air tawar berkualitas tinggi dari budidaya terpercaya dengan
              pelacakan batch yang transparan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Jelajahi Marketplace
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#tracking"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/70 transition duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              Lacak Batch
              <ScanSearch className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {featureBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-600 shadow-lg shadow-slate-200/60"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-10 h-28 w-28 rounded-full bg-blue-200/60 blur-3xl" />
          <div className="absolute -right-4 bottom-8 h-28 w-28 rounded-full bg-green-200/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-200 backdrop-blur-xl">
            <div className="rounded-[1.6rem] bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6">
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="overflow-hidden rounded-[1.5rem] border border-blue-100 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.16),_transparent_42%),linear-gradient(135deg,_rgba(239,246,255,1)_0%,_rgba(255,255,255,1)_100%)] p-6">
                  <div className="flex h-full min-h-[280px] flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase">
                        Kartu batch pintar
                      </span>
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="space-y-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                        <Fish className="h-10 w-10" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Batch Panen</p>
                        <p className="mt-2 text-3xl font-semibold text-slate-900">
                          FM-2406-NILA
                        </p>
                        <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">
                          Lacak asal kolam, catatan pakan, jadwal panen, dan
                          status distribusi dalam satu tampilan.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
                    <div className="flex items-center gap-3 text-slate-900">
                      <MapPinned className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">Wilayah Farm</p>
                        <p className="font-semibold">Sentra Air Tawar Jawa Barat</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
                    <p className="text-sm text-slate-500">Kualitas Air</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      98.4%
                    </p>
                    <p className="mt-2 text-sm text-green-600">
                      Metrik oksigen dan suhu dalam kondisi stabil
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-slate-200 bg-gradient-to-br from-blue-50 to-green-50 p-5 shadow-lg shadow-slate-200/70">
                    <p className="text-sm text-slate-600">Kesiapan pengiriman</p>
                    <div className="mt-4 h-3 rounded-full bg-slate-200">
                      <div className="h-3 w-[82%] rounded-full bg-gradient-to-r from-blue-600 to-green-600" />
                    </div>
                    <p className="mt-3 text-sm text-slate-500">
                      82% hasil panen hari ini sudah siap untuk dikirim
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
