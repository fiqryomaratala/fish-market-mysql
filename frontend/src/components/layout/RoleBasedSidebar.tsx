import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
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
  const desktopToggleClassName =
    'hidden lg:flex size-12 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
  const mobileCloseClassName =
    'flex size-12 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden'

  return (
    <div
      className={`flex h-full flex-col bg-white ${
        collapsed
          ? 'px-2.5 py-4'
          : 'px-4 py-4'
      }`}
    >
      <div
        className={`border-b border-slate-200 pb-4 ${
          collapsed
            ? 'flex justify-center'
            : 'grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center'
        }`}
      >
        {collapsed ? null : <div aria-hidden="true" className="hidden lg:block h-12 w-8" />}

        {!collapsed ? (
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Fish Market
            </p>
            <p className="truncate text-xs text-slate-500">Navigation for {role ?? 'guest'}</p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={desktopToggleClassName}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className={mobileCloseClassName}
          aria-label="Close navigation drawer"
        >
          <X className="size-4" />
        </button>
      </div>

      <nav className={`mt-5 flex-1 ${collapsed ? 'space-y-6' : 'space-y-2.5'}`}>
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
                `group flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${
                  collapsed ? 'rounded-[10px] px-0 py-0' : 'rounded-[10px] px-1.5 py-1.5'
                } transition ${
                  isActive
                    ? 'text-blue-700'
                    : 'text-slate-500 hover:text-blue-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex shrink-0 items-center justify-center border transition ${
                      collapsed ? 'size-[3.3rem] rounded-[10px]' : 'size-12 rounded-[10px]'
                    } ${
                      isActive
                        ? 'border-blue-600 bg-blue-600 text-white shadow-none ring-0'
                        : 'border-slate-200 bg-white text-blue-500 shadow-none ring-0 group-hover:border-blue-200 group-hover:text-blue-600'
                    }`}
                  >
                    <Icon className="size-4" />
                  </span>

                  {!collapsed ? (
                    <>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {item.title}
                      </span>
                      {badge ? (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500">
                          {badge}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {collapsed ? (
        <div className="mt-3 h-8" />
      ) : (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <p className="font-semibold">Workspace online</p>
          <p className="mt-1 text-xs leading-6 text-emerald-600">
            Menu otomatis mengikuti role user yang sedang login.
          </p>
        </div>
      )}
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
        className={`hidden h-screen shrink-0 border-r border-slate-200 bg-white lg:block ${
          collapsed ? 'w-[6.5rem]' : 'w-[17.5rem]'
        } transition-[width] duration-300`}
      >
        <div className="h-full overflow-hidden">
          <SidebarContent
            collapsed={collapsed}
            onCloseMobile={onCloseMobile}
            onToggleCollapse={onToggleCollapse}
          />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/35 backdrop-blur-sm lg:hidden">
          <div className="h-full max-w-[18rem] bg-white p-4">
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
