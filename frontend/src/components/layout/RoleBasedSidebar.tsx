import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { useNavigation } from '@/hooks/useNavigation'

type RoleBasedSidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
  onToggleCollapse: () => void
}

const badgeMap: Record<string, string> = {
  Orders: '3',
  Notifications: '8',
  Harvest: '2',
  Inventory: '12',
}

function SidebarContent({
  collapsed,
  onCloseMobile,
  onToggleCollapse,
}: Omit<RoleBasedSidebarProps, 'mobileOpen'>) {
  const { items, role } = useNavigation()

  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-slate-950/85 p-4 shadow-2xl shadow-slate-950/50 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Logo />
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Fish Market
              </p>
              <p className="truncate text-xs text-slate-400">Navigation for {role ?? 'guest'}</p>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white lg:block"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white lg:hidden"
          aria-label="Close navigation drawer"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const badge = badgeMap[item.title]

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin' || item.path === '/staff'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                  isActive
                    ? 'bg-cyan-400/15 text-white shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-300/30'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300 transition group-hover:border-cyan-300/30">
                <Icon className="size-4" />
              </span>

              {!collapsed ? (
                <>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
                  {badge ? (
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-1 text-[11px] font-semibold text-cyan-100">
                      {badge}
                    </span>
                  ) : null}
                </>
              ) : null}
            </NavLink>
          )
        })}
      </nav>

      {!collapsed ? (
        <div className="rounded-xl border border-emerald-300/15 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          <p className="font-semibold">Workspace online</p>
          <p className="mt-1 text-xs leading-6 text-emerald-50/80">
            Menu otomatis mengikuti role user yang sedang login.
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function RoleBasedSidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: RoleBasedSidebarProps) {
  return (
    <>
      <aside
        className={`hidden lg:block ${
          collapsed ? 'w-[5.5rem]' : 'w-[18rem]'
        } transition-[width] duration-300`}
      >
        <SidebarContent
          collapsed={collapsed}
          onCloseMobile={onCloseMobile}
          onToggleCollapse={onToggleCollapse}
        />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden">
          <div className="h-full max-w-[18rem] p-4">
            <SidebarContent
              collapsed={false}
              onCloseMobile={onCloseMobile}
              onToggleCollapse={onToggleCollapse}
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
