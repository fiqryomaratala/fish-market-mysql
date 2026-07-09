import {
  ArrowRight,
  MapPinned,
  ScanSearch,
} from 'lucide-react'
import { resolveAssetUrl } from '@/utils/asset'

const nilaBatchImage = resolveAssetUrl('/uploads/products/876741e5-0186-45b3-be16-06633e1aeba9.jpg')

export function HeroSection() {
  return (
    <section
      id="home"
      className="landing-blue-band px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8">
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
              className="landing-blue-button-soft inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-semibold transition duration-300"
            >
              Jelajahi Marketplace
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#tracking"
              className="landing-blue-button-soft inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-semibold transition duration-300"
            >
              Lacak Batch
              <ScanSearch className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="landing-blue-panel relative overflow-hidden rounded-xl border bg-white p-4">
            <div className="rounded-xl bg-slate-50 p-6">
              <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <div className="h-48 overflow-hidden border-b border-slate-200 bg-slate-100 lg:h-52">
                    <img
                      src={nilaBatchImage}
                      alt="Batch panen ikan nila"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex h-full min-h-[180px] flex-col justify-between">
                      <div className="space-y-3">
                        <p className="text-sm text-slate-500">Batch Panen</p>
                        <p className="text-3xl font-semibold text-slate-900">
                          FM-2406-NILA
                        </p>
                        <p className="max-w-xs text-sm leading-7 text-slate-500">
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
                      <MapPinned className="landing-blue-text h-5 w-5" />
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
