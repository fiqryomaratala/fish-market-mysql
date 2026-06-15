import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'
import { RoleBasedNavbar } from '@/components/layout/RoleBasedNavbar'
import { RoleBasedSidebar } from '@/components/layout/RoleBasedSidebar'
import { useAuth } from '@/hooks/useAuth'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, loading } = useAuth()
  const isLandingPage = location.pathname === '/'
  const isMarketplacePage =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/orders')
  const shouldUseAuthenticatedMarketplaceShell =
    isMarketplacePage && !loading && isAuthenticated

  if (isLandingPage) {
    return <Outlet />
  }

  if (shouldUseAuthenticatedMarketplaceShell) {
    return (
      <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_20%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_58%,_#eff6ff_100%)] text-slate-900">
        <RoleBasedSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <RoleBasedNavbar onOpenMobileMenu={() => setMobileOpen(true)} />

          <div className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto max-w-[1600px] px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-4">
              <main className="min-h-full min-w-0 rounded-[1.75rem] border border-slate-200/90 bg-white/92 p-4 shadow-[0_24px_70px_rgba(148,163,184,0.16)] backdrop-blur-xl transition sm:p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        isMarketplacePage
          ? 'min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.10),_transparent_24%),linear-gradient(180deg,_#ffffff_0%,_#f9fafb_56%,_#f3f4f6_100%)] text-slate-900'
          : 'min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_60%,_#111827_100%)] text-white'
      }
    >
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
