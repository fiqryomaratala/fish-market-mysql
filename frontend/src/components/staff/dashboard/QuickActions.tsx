import { ClipboardPlus, Fish, PackagePlus, Waves } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const actions = [
  {
    label: 'Tambah Log Pakan',
    description: 'Catat pemberian pakan harian',
    icon: ClipboardPlus,
    path: '/staff/feeding-logs',
  },
  {
    label: 'Tambah Panen',
    description: 'Input hasil panen terbaru',
    icon: PackagePlus,
    path: '/staff/harvests',
  },
  {
    label: 'View Fish Batches',
    description: 'Pantau status batch ikan',
    icon: Fish,
    path: '/staff/fish-batches',
  },
  {
    label: 'View Ponds',
    description: 'Lihat kondisi seluruh kolam',
    icon: Waves,
    path: '/staff/ponds',
  },
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
          Quick Actions
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-950">Aksi cepat operasional</h2>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.path)}
              className="rounded-[1.25rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(248,250,252,0.9),_rgba(255,255,255,1))] p-4 text-left transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-[0_18px_36px_rgba(34,211,238,0.14)]"
            >
              <div className="inline-flex rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-950">{action.label}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
