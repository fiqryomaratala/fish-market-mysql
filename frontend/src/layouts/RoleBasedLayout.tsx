import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RoleBasedNavbar } from '@/components/layout/RoleBasedNavbar'
import { RoleBasedSidebar } from '@/components/layout/RoleBasedSidebar'

export function RoleBasedLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_20%),linear-gradient(180deg,_#ffffff_0%,_#f8fafc_58%,_#eff6ff_100%)] text-slate-900">
      <RoleBasedNavbar onOpenMobileMenu={() => setMobileOpen(true)} />

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6">
        <RoleBasedSidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
        />

        <main className="min-w-0 flex-1 rounded-[1.5rem] border border-slate-200 bg-white/90 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur-xl transition sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
