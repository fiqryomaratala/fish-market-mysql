import { Outlet } from 'react-router-dom'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { adminNavigation } from '@/config/navigation'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <SidebarNav items={adminNavigation} title="Admin Workspace" />
        <main className="panel min-h-[70vh]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
