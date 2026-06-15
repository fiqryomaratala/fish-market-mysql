import { Outlet, useLocation } from 'react-router-dom'
import { AppFooter } from '@/components/layout/AppFooter'
import { AppHeader } from '@/components/layout/AppHeader'

export function MainLayout() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'
  const isMarketplacePage =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout')

  if (isLandingPage) {
    return <Outlet />
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
