import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  UserCircle2,
} from 'lucide-react'
import { getRoleLabel } from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNavigation } from '@/hooks/useNavigation'
import { useNotifications } from '@/hooks/useNotifications'

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
  const { profilePath, settingsPath } = useNavigation()
  const notificationsQuery = useNotifications({ page: 1, limit: 6 })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const unreadCount = (notificationsQuery.data?.items ?? []).filter((item) => !item.is_read).length

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
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="rounded-[10px] border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            aria-label="Open navigation drawer"
          >
            <Menu className="size-5" />
          </button>

          <NavLink to="/" className="flex items-center gap-3 px-1 py-1 transition hover:text-blue-600">
            <span className="flex size-12 items-center justify-center rounded-[10px] bg-linear-to-br from-cyan-300 via-sky-400 to-emerald-300 text-lg font-black text-slate-950">
              FM
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">
                Fish Market
              </p>
              <p className="text-xs text-slate-500">Ruang kerja ERP</p>
            </div>
          </NavLink>
        </div>

        <div className="order-3 w-full md:order-none md:max-w-md md:flex-1">
          <label className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm shadow-slate-200/40">
            <Search className="size-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari pengguna, pesanan, produk, kolam..."
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <NavLink
            to="/admin/notifications"
            className="relative rounded-[10px] border border-white/70 bg-white/85 p-2.5 text-slate-600 shadow-sm shadow-slate-200/40 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            aria-label="Notifikasi"
          >
            <Bell className="size-5" />
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            ) : null}
          </NavLink>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((current) => !current)}
              className="flex items-center gap-3 rounded-[10px] border border-white/70 bg-white/85 px-2.5 py-2 text-left text-slate-700 shadow-sm shadow-slate-200/40 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-10 rounded-[10px] object-cover"
                />
              ) : (
                <span className="flex size-10 items-center justify-center rounded-[10px] bg-gradient-to-br from-cyan-300 via-sky-400 to-emerald-300 text-sm font-bold text-slate-950">
                  {getInitials(user?.name)}
                </span>
              )}
              <span className="hidden min-w-0 sm:block">
                <span className="block truncate text-sm font-semibold text-slate-900">
                  {user?.name ?? 'Pengguna'}
                </span>
                <span className="block truncate text-xs text-slate-500">{getRoleLabel(role)}</span>
              </span>
              <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
            </button>

            {dropdownOpen ? (
              <div className="absolute right-0 mt-2 w-56 rounded-[10px] border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
                <NavLink
                  to={profilePath}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <UserCircle2 className="size-4 text-blue-600" />
                  <span>Profil</span>
                </NavLink>
                <NavLink
                  to={settingsPath}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
                >
                  <Settings className="size-4 text-emerald-600" />
                  <span>Pengaturan</span>
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
                  <span>Keluar</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
