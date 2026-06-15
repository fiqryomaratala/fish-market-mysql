import { NavLink } from 'react-router-dom'
import type { NavItem } from '@/types/navigation'

type SidebarNavProps = {
  items: NavItem[]
  title: string
}

export function SidebarNav({ items, title }: SidebarNavProps) {
  return (
    <aside className="panel h-fit min-w-0 lg:sticky lg:top-24 lg:w-72">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
          {title}
        </p>
      </div>
      <nav className="space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/customer' || item.path === '/admin'}
            className={({ isActive }) =>
              `block rounded-2xl border px-4 py-3 transition ${
                isActive
                  ? 'border-cyan-300/50 bg-cyan-400/15 text-white'
                  : 'border-white/8 text-slate-300 hover:border-white/20 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <p className="font-medium">{item.title}</p>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
