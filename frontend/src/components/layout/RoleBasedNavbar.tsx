import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Bell, ChevronDown, LogOut, Menu, Settings, UserCircle2 } from 'lucide-react'
import { getRoleLabel } from '@/config/navigation'
import { Logo } from '@/components/ui/Logo'
import { useAuth } from '@/hooks/useAuth'
import { useNavigation } from '@/hooks/useNavigation'

type RoleBasedNavbarProps = {
  onOpenMobileMenu: () => void
}

function getInitials(name?: string) {
  if (!name) {
    return 'FM'
  }

  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function RoleBasedNavbar({ onOpenMobileMenu }: RoleBasedNavbarProps) {
  const { user, role, logout } = useAuth()
  const { items, profilePath, settingsPath } = useNavigation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    window.addEventListener('mousedown', handleOutsideClick)

    return () => window.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <header className="sticky top-0 z-30 rounded-b-[1.5rem] border-b border-white/10 bg-slate-950/80 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-cyan-300/40 hover:text-white lg:hidden"
            aria-label="Open navigation drawer"
          >
            <Menu className="size-5" />
          </button>

          <NavLink to="/" className="flex items-center gap-3">
            <Logo />
            <div className="hidden sm:block">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Fish Market
              </p>
              <p className="text-xs text-slate-400">Modern role-based workspace</p>
            </div>
          </NavLink>
        </div>

        <nav className="hidden items-center gap-2 xl:flex">
          {items.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/staff'}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2 text-sm transition ${
                  isActive
                    ? 'bg-cyan-300/15 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              8
            </span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((current) => !current)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-left text-slate-200 transition hover:border-cyan-300/40 hover:text-white"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-300 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/20">
                {getInitials(user?.name)}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold text-white">
                  {user?.name ?? 'Guest'}
                </span>
                <span className="block truncate text-xs text-slate-400">
                  {getRoleLabel(role)}
                </span>
              </span>
              <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
                <NavLink
                  to={profilePath}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                >
                  <UserCircle2 className="size-4 text-cyan-300" />
                  <span>Profile</span>
                </NavLink>
                <NavLink
                  to={settingsPath}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
                >
                  <Settings className="size-4 text-cyan-300" />
                  <span>Settings</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    void logout()
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-200 transition hover:bg-rose-400/10 hover:text-rose-100"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
