import {
  BadgeCheck,
  Fish,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useState } from 'react'

const reasons = [
  {
    icon: Fish,
    title: 'Panen Segar',
    description:
      'Produk langsung dipanen dari kolam terpilih untuk menjaga rasa, tekstur, dan kualitas terbaik.',
  },
  {
    icon: BadgeCheck,
    title: 'Kualitas Tersertifikasi',
    description:
      'Setiap batch mengikuti standar inspeksi mutu, sanitasi, dan pencatatan produksi yang rapi.',
  },
  {
    icon: Truck,
    title: 'Pengiriman Cepat',
    description:
      'Proses pemenuhan pesanan cepat dengan koordinasi stok dan logistik yang terintegrasi dari farm ke pelanggan.',
  },
  {
    icon: ShieldCheck,
    title: 'Pelacakan Transparan',
    description:
      'Pembeli dapat melacak asal batch, histori pakan, dan tahapan distribusi secara jelas.',
  },
]

function getCardPlacement(index: number, activeIndex: number, total: number) {
  const delta = (index - activeIndex + total) % total

  if (delta === 0) {
    return {
      left: '50%',
      top: '0px',
      translateX: '-50%',
      scale: 1,
      opacity: 1,
      zIndex: 30,
      width: '32%',
      pointerEvents: 'auto' as const,
    }
  }

  if (delta === total - 1) {
    return {
      left: '16%',
      top: '36px',
      translateX: '-50%',
      scale: 0.9,
      opacity: 0.92,
      zIndex: 20,
      width: '26%',
      pointerEvents: 'auto' as const,
    }
  }

  if (delta === 1) {
    return {
      left: '84%',
      top: '36px',
      translateX: '-50%',
      scale: 0.9,
      opacity: 0.92,
      zIndex: 20,
      width: '26%',
      pointerEvents: 'auto' as const,
    }
  }

  return {
    left: '50%',
    top: '78px',
    translateX: '-50%',
    scale: 0.82,
    opacity: 0.4,
    zIndex: 10,
    width: '22%',
    pointerEvents: 'none' as const,
  }
}

export function WhyChooseUs() {
  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Dibangun untuk kepercayaan, keterlacakan, dan perdagangan ikan premium
          </h2>
        </div>

        <div className="mt-10 grid gap-5 xl:hidden">
          {reasons.map(({ icon: Icon, title, description }, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={title}
                type="button"
                className={`rounded-[1.5rem] border p-6 text-left shadow-sm transition duration-300 ${
                  isActive
                    ? 'landing-blue-band border-sky-300/40 text-white shadow-[0_22px_55px_rgba(8,47,73,0.24)]'
                    : 'border-slate-200 bg-white text-slate-900'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isActive ? 'bg-white/12' : 'landing-blue-icon'
                    }`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className={`text-xl font-semibold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                      {title}
                    </h3>
                    <p className={`text-sm leading-7 ${isActive ? 'text-blue-50/88' : 'text-slate-500'}`}>
                      {description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="relative mt-10 hidden h-[30rem] xl:block">
          {reasons.map(({ icon: Icon, title, description }, index) => {
            const placement = getCardPlacement(index, activeIndex, reasons.length)
            const isActive = index === activeIndex

            return (
              <button
                key={title}
                type="button"
                className={`absolute overflow-hidden rounded-[1.75rem] border text-left transition-all duration-500 ease-out ${
                  isActive
                    ? 'landing-blue-band border-sky-300/35 text-white shadow-[0_34px_70px_rgba(8,47,73,0.26)]'
                    : 'border-slate-200 bg-white shadow-[0_16px_36px_rgba(148,163,184,0.12)]'
                }`}
                style={{
                  left: placement.left,
                  top: placement.top,
                  width: placement.width,
                  zIndex: placement.zIndex,
                  opacity: placement.opacity,
                  pointerEvents: placement.pointerEvents,
                  transform: `translateX(${placement.translateX}) scale(${placement.scale})`,
                }}
                onClick={() => setActiveIndex(index)}
              >
                <div className={`flex h-[22rem] flex-col ${isActive ? 'justify-start gap-7 p-8' : 'justify-start gap-5 p-7 pt-8'}`}>
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      isActive ? 'bg-white/12' : 'landing-blue-soft border'
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${isActive ? 'text-white' : 'landing-blue-text'}`} />
                  </div>

                  <div className={`${isActive ? 'space-y-3' : 'space-y-4'}`}>
                    <h3
                      className={`font-semibold leading-tight ${
                        isActive ? 'max-w-[11rem] text-[2rem] text-white' : 'max-w-[13rem] text-[1.9rem] text-slate-900'
                      }`}
                    >
                      {title}
                    </h3>
                    <p
                      className={`text-sm leading-8 ${
                        isActive ? 'max-w-[18rem] text-blue-50/88' : 'max-w-[15rem] text-slate-500'
                      }`}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
