import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react'
import { publicNavigation } from '@/config/navigation'
import { Logo } from '@/components/ui/Logo'
import { getRoleLabel } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNavigation } from '@/hooks/useNavigation'

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

export function AppHeader() {
  const location = useLocation()
  const { user, role, isAuthenticated, logout } = useAuth()
  const { profilePath } = useNavigation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const isMarketplaceTheme =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/orders')
  const navigationItems = isAuthenticated
    ? publicNavigation.filter((item) => item.path !== '/login')
    : publicNavigation

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
          {navigationItems.map((item) => (
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

        {isAuthenticated ? (
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((current) => !current)}
              className={`flex items-center gap-3 rounded-[10px] border px-2.5 py-2 text-left shadow-sm transition ${
                isMarketplaceTheme
                  ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
                  : 'border-white/10 bg-white/5 text-slate-200 hover:border-cyan-300/40 hover:text-white'
              }`}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-10 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {getInitials(user?.name)}
                </span>
              )}
              <span className="hidden min-w-0 sm:block">
                <span
                  className={`block truncate text-sm font-semibold ${
                    isMarketplaceTheme ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {user?.name ?? 'Guest'}
                </span>
                <span
                  className={`block truncate text-xs ${
                    isMarketplaceTheme ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {getRoleLabel(role)}
                </span>
              </span>
              <ChevronDown
                className={`hidden size-4 sm:block ${
                  isMarketplaceTheme ? 'text-slate-400' : 'text-slate-400'
                }`}
              />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-[10px] border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
                <NavLink
                  to={profilePath}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <UserCircle2 className="size-4 text-blue-600" />
                  <span>Profile</span>
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(false)
                    void logout()
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <LogOut className="size-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}
