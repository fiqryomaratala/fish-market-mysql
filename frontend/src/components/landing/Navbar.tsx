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
    <header className="landing-navbar sticky top-0 z-50 border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <Logo className="border-sky-100/80 bg-white/75 shadow-[0_10px_24px_rgba(8,47,73,0.1)]" />
          <div>
            <p className="landing-blue-text text-sm font-semibold tracking-[0.26em] uppercase">
              Fish Market
            </p>
            <p className="text-xs text-slate-500/90">Manajemen Budidaya Modern</p>
          </div>
        </a>

        <nav className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="landing-navbar-link rounded-full px-4 py-2 text-sm font-medium transition duration-300"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="landing-navbar-outline rounded-lg border px-5 py-2.5 text-sm font-semibold transition duration-300"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="landing-blue-button rounded-lg px-5 py-2.5 text-sm font-semibold !text-white transition duration-300 hover:!text-white"
          >
            Daftar
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="landing-navbar-outline inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition lg:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="landing-navbar-panel border-t px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="landing-navbar-link rounded-2xl px-4 py-3 text-sm font-medium transition"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Link
                to="/login"
                className="landing-navbar-outline rounded-lg border px-4 py-3 text-center text-sm font-semibold transition"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="landing-blue-button rounded-lg px-4 py-3 text-center text-sm font-semibold !text-white transition hover:!text-white"
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
