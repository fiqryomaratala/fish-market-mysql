import { Outlet, useLocation } from 'react-router-dom'
import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'

export function MainLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  if (isLandingPage) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.12),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_60%,_#111827_100%)] text-white">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
