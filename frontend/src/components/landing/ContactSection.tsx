import { Mail, MapPin, Phone } from 'lucide-react'

const contacts = [
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Danau Farm No. 8, Bogor, Jawa Barat',
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
    <section id="contact" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/70">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-blue-600 uppercase">
              Kontak
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Mari diskusikan kebutuhan pasokan ikan dan operasional farm Anda
            </h2>
          </div>

          <div className="space-y-4">
            {contacts.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-green-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="mt-1 text-base font-medium text-slate-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70">
          <div className="flex h-full min-h-[360px] flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(135deg,_rgba(249,250,251,1)_0%,_rgba(239,246,255,1)_100%)] p-8">
            <div>
              <p className="text-sm font-semibold tracking-[0.2em] text-blue-600 uppercase">
                Placeholder Peta
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                Lokasi Farm Air Tawar & Titik Distribusi
              </h3>
              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-500">
                Area ini siap diganti dengan integrasi peta interaktif atau
                embedded map ketika backend dan data lokasi sudah tersedia.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">Cakupan</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                  Jabodetabek & Jawa Barat
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
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
