import { useLocation } from 'react-router-dom'

export function AppFooter() {
  const location = useLocation()
  const isMarketplaceTheme =
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/checkout')

  return (
    <footer
      className={
        isMarketplaceTheme
          ? 'border-t border-slate-200 bg-white/80'
          : 'border-t border-white/10 bg-slate-950/80'
      }
    >
      <div
        className={`mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between ${
          isMarketplaceTheme ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        <p>Marketplace Ikan & Sistem Manajemen Budidaya</p>
        <p>React + Vite + Tailwind + TypeScript</p>
      </div>
    </footer>
  )
}
