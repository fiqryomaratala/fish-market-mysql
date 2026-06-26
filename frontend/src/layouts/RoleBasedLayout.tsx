import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { RoleBasedNavbar } from '@/components/layout/RoleBasedNavbar'
import { RoleBasedSidebar } from '@/components/layout/RoleBasedSidebar'

export function RoleBasedLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isStaffRoute = location.pathname.startsWith('/staff')
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAdminDashboard = location.pathname === '/admin' || location.pathname === '/admin/'
  const adminSurface = isAdminRoute ? (isAdminDashboard ? 'dashboard' : 'management') : 'default'

  return (
    <div
      data-role-surface={isStaffRoute ? 'staff' : isAdminRoute ? 'admin' : 'default'}
      data-admin-surface={adminSurface}
      className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_20%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_58%,_#eff6ff_100%)] text-slate-900"
    >
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
