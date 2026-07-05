import { Mail, MapPin, Phone } from 'lucide-react'

const farmAddress = 'Jl. Danau Farm No. 8, Bogor, Jawa Barat'
const embeddedMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  farmAddress,
)}&z=15&output=embed`

const contacts = [
  {
    icon: MapPin,
    label: 'Alamat',
    value: farmAddress,
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@fishmarket.id',
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: '+62 812-3456-7890',
  },
]

export function ContactSection() {
  return (
    <section id="contact" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="landing-blue-panel space-y-6 rounded-xl border bg-white p-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Mari diskusikan kebutuhan pasokan ikan dan operasional farm Anda
            </h2>
            <p className="max-w-xl text-base leading-8 text-slate-600">
              Tim Fish Market siap membantu kebutuhan pasokan, distribusi, dan kolaborasi
              operasional farm dengan respons yang cepat dan terstruktur.
            </p>
          </div>

          <div className="space-y-4">
            {contacts.map(({ icon: Icon, label, value }, index) => (
              <div
                key={label}
                className={`flex items-start gap-4 rounded-xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 ${
                  index === 0
                    ? 'landing-blue-soft'
                    : index === 1
                      ? 'border-emerald-100 bg-emerald-50/60'
                      : 'border-slate-200 bg-white'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    index === 1 ? 'bg-emerald-100 text-emerald-700' : 'landing-blue-icon'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-base font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="landing-blue-panel overflow-hidden rounded-xl border bg-white">
          <div className="flex h-full min-h-[360px] flex-col justify-between bg-[linear-gradient(135deg,_rgba(239,246,255,0.92)_0%,_rgba(219,234,254,0.8)_100%)] p-8">
            <div>
              <p className="landing-blue-text text-sm font-semibold tracking-[0.2em] uppercase">
                Lokasi Farm
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                Lokasi Farm Air Tawar & Titik Distribusi
              </h3>

              <div className="mt-6 overflow-hidden rounded-xl border border-blue-200/60 bg-white shadow-sm">
                <iframe
                  title="Peta lokasi farm Fish Market"
                  src={embeddedMapUrl}
                  className="h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="landing-blue-soft rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Cakupan</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  Jabodetabek & Jawa Barat
                </p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Jam Operasional</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  08:00 - 18:00 WIB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
