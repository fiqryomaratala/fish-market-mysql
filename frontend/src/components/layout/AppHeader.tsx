import { NavLink, useLocation } from 'react-router-dom'
import { publicNavigation } from '@/config/navigation'
import { Logo } from '@/components/ui/Logo'

export function AppHeader() {
  const location = useLocation()
  const isMarketplaceTheme =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout')

  return (
    <header
      className={`sticky top-0 z-20 backdrop-blur-xl ${
        isMarketplaceTheme
          ? 'border-b border-slate-200/80 bg-white/80'
          : 'border-b border-white/10 bg-slate-950/75'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <Logo />
          <div>
            <p
              className={`text-sm font-semibold tracking-[0.22em] uppercase ${
                isMarketplaceTheme ? 'text-blue-600' : 'text-cyan-200'
              }`}
            >
              Fish Market
            </p>
            <p
              className={`text-xs ${
                isMarketplaceTheme ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Manajemen Budidaya
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {publicNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? isMarketplaceTheme
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-cyan-400/20 text-cyan-100'
                    : isMarketplaceTheme
                      ? 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
