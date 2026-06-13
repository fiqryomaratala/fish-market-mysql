import { NavLink } from 'react-router-dom'
import { publicNavigation } from '@/config/navigation'
import { Logo } from '@/components/ui/Logo'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/75 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="text-sm font-semibold tracking-[0.22em] text-cyan-200 uppercase">
              Fish Market
            </p>
            <p className="text-xs text-slate-400">Aquaculture Management</p>
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
                    ? 'bg-cyan-400/20 text-cyan-100'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
