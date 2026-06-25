import { CalendarDays, Sparkles } from 'lucide-react'

interface WelcomeCardProps {
  name: string
}

function getGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Good Morning'
  }

  if (hour < 18) {
    return 'Good Afternoon'
  }

  return 'Good Evening'
}

function formatToday() {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

export function WelcomeCard({ name }: WelcomeCardProps) {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-cyan-200/50 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.24),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_34%),linear-gradient(135deg,_#082f49_0%,_#0f766e_42%,_#14532d_100%)] p-6 text-white shadow-[0_26px_70px_rgba(8,47,73,0.35)] sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/90">
            <Sparkles className="size-4" />
            Staff Budidaya Workspace
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {getGreeting()}, {name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-cyan-50/85">
            Pantau kolam, batch ikan, jadwal panen, dan stok pakan dari satu dashboard operasional
            yang cepat dibaca di lapangan maupun di desktop.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-cyan-50">
            <div className="rounded-xl bg-white/15 p-2.5">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Hari ini</p>
              <p className="mt-1 text-sm font-semibold">{formatToday()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
