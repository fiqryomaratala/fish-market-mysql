import { Menu, Waves, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Beranda', href: '#home' },
  { label: 'Tentang', href: '#about' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'Tracking', href: '#tracking' },
  { label: 'Kontak', href: '#contact' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const closeMenu = () => setIsOpen(false)

    window.addEventListener('resize', closeMenu)

    return () => window.removeEventListener('resize', closeMenu)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-lg shadow-blue-200">
            <Waves className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.26em] text-blue-600 uppercase">
              Fish Market
            </p>
            <p className="text-xs text-slate-500">Manajemen Budidaya</p>
          </div>
        </a>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition duration-300 hover:bg-blue-50 hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:scale-[1.02] hover:bg-blue-700"
          >
            Daftar
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:scale-[1.01] hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Daftar
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
