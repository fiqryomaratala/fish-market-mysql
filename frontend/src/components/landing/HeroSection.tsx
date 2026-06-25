import {
  ArrowRight,
  BadgeCheck,
  Fish,
  MapPinned,
  ScanSearch,
  ShieldCheck,
} from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="home"
      className="bg-blue-600 px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm text-white">
            <BadgeCheck className="h-4 w-4" />
            Budidaya berkelanjutan untuk perdagangan hasil perikanan modern
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Ikan Segar Langsung Dari Farm Berkelanjutan
            </h1>
            <p className="max-w-2xl text-base leading-8 text-blue-50 sm:text-lg">
              Ikan air tawar berkualitas tinggi dari budidaya terpercaya dengan
              pelacakan batch yang transparan.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#marketplace"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 transition duration-300 hover:bg-blue-50"
            >
              Jelajahi Marketplace
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#tracking"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white bg-white px-6 py-3.5 text-sm font-semibold text-blue-700 shadow-sm transition duration-300 hover:bg-blue-50"
            >
              Lacak Batch
              <ScanSearch className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-slate-50 p-6">
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex h-full min-h-[280px] flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-blue-700 uppercase">
                        Kartu batch pintar
                      </span>
                      <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="space-y-5">
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-600 text-white">
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
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3 text-slate-900">
                      <MapPinned className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-slate-500">Wilayah Farm</p>
                        <p className="font-semibold">Sentra Air Tawar Jawa Barat</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">Kualitas Air</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                      98.4%
                    </p>
                    <p className="mt-2 text-sm text-green-600">
                      Metrik oksigen dan suhu dalam kondisi stabil
                    </p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
                    <p className="text-sm text-slate-700">Kesiapan pengiriman</p>
                    <div className="mt-4 h-3 rounded-full bg-green-100">
                      <div className="h-3 w-[82%] rounded-full bg-green-600" />
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
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
