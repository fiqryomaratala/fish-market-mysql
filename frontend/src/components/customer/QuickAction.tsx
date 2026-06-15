import { Fish, Package, ShoppingBag, UserRoundCog } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const quickActions = [
  {
    label: 'Marketplace',
    path: '/products',
    icon: ShoppingBag,
    tone: 'from-blue-600 to-cyan-500',
  },
  {
    label: 'My Orders',
    path: '/orders',
    icon: Package,
    tone: 'from-emerald-600 to-teal-500',
  },
  {
    label: 'Track Fish Batch',
    path: '/tracking',
    icon: Fish,
    tone: 'from-sky-600 to-blue-500',
  },
  {
    label: 'Profile',
    path: '/customer/profile',
    icon: UserRoundCog,
    tone: 'from-cyan-600 to-emerald-500',
  },
] as const

export function QuickAction() {
  const navigate = useNavigate()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Quick Action
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Akses Cepat</h2>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => {
                if (action.path === '/tracking') {
                  document.getElementById('tracking-batch')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                  return
                }

                navigate(action.path)
              }}
              className={`group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r ${action.tone} px-5 py-4 text-left text-white shadow-lg transition hover:-translate-y-0.5`}
            >
              <span className="rounded-xl bg-white/15 p-3">
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold">{action.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
