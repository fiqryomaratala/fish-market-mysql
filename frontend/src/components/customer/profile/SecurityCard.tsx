import { KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'

type SecurityCardProps = {
  onChangePassword: () => void
}

export function SecurityCard({ onChangePassword }: SecurityCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-100/70">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
            Keamanan
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Jaga keamanan akun Anda</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Ubah kata sandi secara berkala untuk menjaga akses akun pelanggan tetap aman dan terpercaya.
          </p>
        </div>

        <button
          type="button"
          onClick={onChangePassword}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <KeyRound className="size-4" />
          Ubah Kata Sandi
        </button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SecurityFeature
          icon={ShieldCheck}
          title="Sesi Terlindungi"
          description="Autentikasi menggunakan Bearer Token dengan proteksi route pelanggan."
        />
        <SecurityFeature
          icon={LockKeyhole}
          title="Pembaruan Kata Sandi"
          description="Kata sandi baru divalidasi minimal 8 karakter sebelum dikirim ke backend."
        />
        <SecurityFeature
          icon={KeyRound}
          title="Akses Cepat"
          description="Akses ubah kata sandi tersedia langsung dari halaman profil tanpa pindah route."
        />
      </div>
    </section>
  )
}

type SecurityFeatureProps = {
  icon: typeof ShieldCheck
  title: string
  description: string
}

function SecurityFeature({ icon: Icon, title, description }: SecurityFeatureProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition duration-200 hover:border-cyan-200 hover:bg-cyan-50/40">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Icon className="size-5 text-sky-600" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  )
}
