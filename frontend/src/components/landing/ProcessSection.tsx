import feedingImage from '@/assets/feeding.jpg'
import fishBatchImage from '@/assets/fish-batch.jpg'
import harvestImage from '@/assets/harvest.jpeg'
import marketplaceImage from '@/assets/marketplace.png'
import pondImage from '@/assets/pond.jpg'

const pondDeepSeaGradient =
  'linear-gradient(135deg, #0a3554 0%, #14507d 52%, #39a6df 100%)'

const steps = [
  {
    title: 'Pond',
    variant: 'featured',
    description:
      'Kolam dipetakan dengan parameter kualitas air, kapasitas budidaya, dan kondisi operasional harian.',
    detail:
      'Setiap kolam menjadi fondasi operasional dengan pencatatan lokasi, volume air, kepadatan tebar, dan indikator mutu lingkungan agar tim bisa mengambil keputusan harian dengan lebih akurat dan konsisten.',
  },
  {
    title: 'Fish Batch',
    variant: 'compact',
    description: 'Batch ikan dicatat dengan identitas yang jelas.',
    detail: 'Riwayat budidaya lebih mudah ditelusuri dari awal.',
  },
  {
    title: 'Feeding',
    variant: 'wide',
    description: 'Pemberian pakan dipantau agar budidaya tetap stabil.',
    detail: 'Catatan pakan membantu menjaga efisiensi pertumbuhan.',
  },
  {
    title: 'Harvest',
    variant: 'wide',
    description: 'Panen dicatat tepat waktu untuk menjaga kualitas hasil.',
    detail: 'Hasil panen siap ditelusuri sebelum masuk ke distribusi.',
  },
  {
    title: 'Marketplace',
    variant: 'compact',
    description: 'Produk tampil di etalase digital dengan info siap jual.',
    detail: 'Pelanggan dapat melihat stok dan detail produk dengan cepat.',
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

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(220px,_auto)]">
          {steps.map(({ title, variant, description, detail }, index) => {
            if (variant === 'featured') {
              return (
                <article
                  key={title}
                  className="overflow-hidden rounded-[10px] border border-slate-200 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md lg:col-span-4 lg:row-span-2"
                  style={{ background: pondDeepSeaGradient }}
                >
                  <div className="-mb-px h-56 overflow-hidden lg:h-60">
                    <img
                      src={pondImage}
                      alt="Kolam budidaya ikan"
                      className="block h-full w-full object-cover"
                    />
                  </div>
                  <div
                    className="-mt-px flex min-h-[18rem] flex-col justify-between bg-transparent p-7 text-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.08em] text-white/88">
                        Tahap {index + 1}
                      </span>
                      <span className="text-6xl font-semibold leading-none text-white/18">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="space-y-5">
                      <h3 className="max-w-sm text-[2.4rem] font-semibold leading-[1.05]">
                        {title}
                      </h3>
                      <div className="h-px w-24 bg-white/25" />
                      <p className="max-w-md text-sm leading-8 text-blue-50/88">
                        {description}
                      </p>
                      <p className="max-w-md text-sm leading-8 text-blue-100/74">
                        {detail}
                      </p>
                    </div>
                  </div>
                </article>
              )
            }

            if (variant === 'compact') {
              const compactImage =
                title === 'Fish Batch'
                  ? {
                      src: fishBatchImage,
                      alt: 'Tampilan detail batch ikan budidaya',
                    }
                  : title === 'Marketplace'
                  ? {
                      src: marketplaceImage,
                      alt: 'Tampilan halaman marketplace produk ikan',
                    }
                  : null

              return (
                <article
                  key={title}
                  className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md lg:col-span-4"
                >
                  {compactImage ? (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={compactImage.src}
                        alt={compactImage.alt}
                        className={`block h-full w-full object-cover ${
                          title === 'Marketplace' ? 'object-left-top' : 'object-center'
                        }`}
                      />
                    </div>
                  ) : null}
                  <div className="space-y-5 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="landing-blue-soft landing-blue-text rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.08em]">
                        Tahap {index + 1}
                      </span>
                      <span className="landing-blue-text text-sm font-semibold">0{index + 1}</span>
                    </div>
                    <div className="space-y-3">
                      <h3 className={`font-semibold leading-tight text-slate-900 ${title === 'Fish Batch' ? 'whitespace-nowrap text-[1.7rem]' : 'text-[1.85rem]'}`}>
                        {title}
                      </h3>
                      <p className="text-sm leading-8 text-slate-500">{description}</p>
                      <p className="text-sm leading-7 text-slate-400">{detail}</p>
                    </div>
                  </div>
                </article>
              )
            }

            const inlineImage =
              title === 'Feeding'
                ? {
                    src: feedingImage,
                    alt: 'Pakan ikan di area kolam budidaya',
                  }
                : title === 'Harvest'
                  ? {
                      src: harvestImage,
                      alt: 'Proses panen ikan di kolam budidaya',
                    }
                  : null

            return (
              <article
                key={title}
                className="overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md lg:col-span-4"
              >
                {inlineImage ? (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={inlineImage.src}
                      alt={inlineImage.alt}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div className="space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <div className="landing-blue-icon h-3.5 w-3.5 rounded-full" />
                    <span className="landing-blue-text text-sm font-semibold tracking-[0.06em]">
                      Tahap {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[2rem] font-semibold leading-tight text-slate-900">
                      {title}
                    </h3>
                    <p className="max-w-xl text-sm leading-8 text-slate-500">
                      {description}
                    </p>
                    <p className="max-w-xl text-sm leading-7 text-slate-400">
                      {detail}
                    </p>
                  </div>
                  <div className="landing-blue-line h-px w-full" />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
