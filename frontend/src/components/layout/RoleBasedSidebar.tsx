import { NavLink, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useNavigation } from '@/hooks/useNavigation'

type RoleBasedSidebarProps = {
  collapsed: boolean
  mobileOpen: boolean
  onCloseMobile: () => void
  onToggleCollapse: () => void
}

function SidebarContent({
  collapsed,
  onCloseMobile,
  onToggleCollapse,
}: Omit<RoleBasedSidebarProps, 'mobileOpen'>) {
  const { items, role } = useNavigation()
  const location = useLocation()
  const desktopToggleClassName =
    'hidden lg:flex size-12 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
  const mobileCloseClassName =
    'flex size-12 items-center justify-center rounded-[10px] border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden'
  const expandedContentClassName = collapsed
    ? 'pointer-events-none max-w-0 translate-x-2 opacity-0'
    : 'max-w-[13rem] translate-x-0 opacity-100'

  return (
    <div
      className={`flex h-full min-h-0 flex-col bg-white transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        collapsed
          ? 'px-2.5 py-4'
          : 'px-4 py-4'
      }`}
    >
      <div
        className={`border-b border-slate-200 pb-4 transition-[grid-template-columns,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed
            ? 'flex justify-center'
            : 'grid grid-cols-[2rem_minmax(0,1fr)_3rem] items-center'
        }`}
      >
        <div
          aria-hidden="true"
          className={`hidden h-12 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:block ${
            collapsed ? 'w-0 opacity-0' : 'w-8 opacity-100'
          }`}
        />

        <div
          className={`min-w-0 overflow-hidden text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${expandedContentClassName}`}
        >
          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Fish Market
            </p>
            <p className="truncate text-xs text-slate-500">Navigation for {role ?? 'guest'}</p>
          </div>
        </div>

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

      <div className="mt-5 min-h-0 flex-1 overflow-hidden">
        <nav
          className={`scrollbar-hidden h-full overflow-y-auto transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            collapsed ? 'pr-0' : 'pr-1'
          } ${
            collapsed ? 'space-y-6' : 'space-y-2.5'
          }`}
        >
          {items.map((item) => {
            const Icon = item.icon
            const isMarketplaceAliasActive =
              role === 'customer' &&
              item.path === '/customer/marketplace' &&
              location.pathname.startsWith('/products')
            const isCartAliasActive =
              role === 'customer' &&
              item.path === '/customer/cart' &&
              location.pathname.startsWith('/cart')
            const isOrdersAliasActive =
              role === 'customer' && item.path === '/orders' && location.pathname.startsWith('/orders')
            const isActiveItem =
              isMarketplaceAliasActive || isCartAliasActive || isOrdersAliasActive

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/staff'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group flex items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${collapsed ? 'justify-center' : 'gap-3'} ${
                    collapsed ? 'rounded-[10px] px-0 py-0' : 'rounded-[10px] px-1.5 py-1.5'
                  } transition ${
                    isActive || isActiveItem
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
                        isActive || isActiveItem
                          ? 'border-blue-600 bg-blue-600 text-white shadow-none ring-0'
                          : 'border-slate-200 bg-white text-blue-500 shadow-none ring-0 group-hover:border-blue-200 group-hover:text-blue-600'
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>

                    <span
                      className={`min-w-0 flex-1 truncate text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${expandedContentClassName}`}
                    >
                        {item.title}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div
        className={`mt-3 shrink-0 overflow-hidden rounded-[10px] border bg-emerald-50 text-sm text-emerald-700 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed
            ? 'max-h-0 border-transparent opacity-0'
            : 'max-h-32 border-emerald-200 opacity-100'
        }`}
      >
        <div className="p-4">
          <p className="font-semibold">Ruang kerja aktif</p>
          <p className="mt-1 text-xs leading-6 text-emerald-600">
            Menu otomatis mengikuti role user yang sedang login.
          </p>
        </div>
      </div>
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
        className={`sidebar-shell hidden h-screen shrink-0 border-r border-slate-200 bg-white lg:block ${
          collapsed ? 'w-[6.5rem]' : 'w-[17.5rem]'
        } transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]`}
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
