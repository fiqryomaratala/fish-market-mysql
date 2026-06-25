import { Facebook, Instagram, Linkedin, Waves } from 'lucide-react'

const quickLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Tracking', href: '#tracking' },
  { label: 'Kontak', href: '#contact' },
]

const socials = [
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'Facebook', icon: Facebook, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Waves className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.26em] text-blue-700 uppercase">
                Fish Market
              </p>
              <p className="text-xs text-slate-500">Manajemen Budidaya</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-slate-500">
            Marketplace ikan dan sistem budidaya modern untuk operasional farm,
            traceability batch, dan pengalaman pembelian yang lebih terpercaya.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] text-slate-900 uppercase">
            Tautan Cepat
          </h3>
          <div className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm text-slate-500 transition hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.2em] text-slate-900 uppercase">
            Media Sosial
          </h3>
          <div className="mt-4 flex gap-3">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition duration-300 hover:border-slate-300 hover:text-slate-900"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-200 pt-6 text-sm text-slate-500">
        Hak Cipta © 2026 Fish Market. Seluruh hak dilindungi.
      </div>
    </footer>
  )
}
