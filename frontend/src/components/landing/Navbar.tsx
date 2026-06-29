import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/ui/Logo'

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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-sm font-semibold tracking-[0.26em] text-emerald-700 uppercase">
              Fish Market
            </p>
            <p className="text-xs text-slate-500">Manajemen Budidaya Modern</p>
          </div>
        </a>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition duration-300 hover:bg-white hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:border-blue-200 hover:text-blue-700"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold !text-white transition duration-300 hover:bg-blue-700 hover:!text-white"
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
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold !text-white transition hover:bg-blue-700 hover:!text-white"
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
