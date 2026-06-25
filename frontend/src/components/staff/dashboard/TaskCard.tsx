import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, TimerReset } from 'lucide-react'
import type { StaffTask } from '@/types/staff-dashboard'

interface TaskCardProps {
  task: StaffTask
}

const statusStyles: Record<StaffTask['status'], string> = {
  Pending: 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
  Attention: 'bg-rose-100 text-rose-700',
}

const priorityStyles: Record<StaffTask['priority'], string> = {
  Low: 'bg-slate-100 text-slate-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-rose-100 text-rose-700',
}

function renderStatusIcon(status: StaffTask['status']) {
  if (status === 'Completed') {
    return <CheckCircle2 className="size-5" />
  }

  if (status === 'Attention') {
    return <AlertTriangle className="size-5" />
  }

  if (status === 'In Progress') {
    return <TimerReset className="size-5" />
  }

  return <Clock3 className="size-5" />
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{task.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{task.description}</p>
        </div>
        <div className={`rounded-2xl p-3 ${statusStyles[task.status]}`}>
          {renderStatusIcon(task.status)}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status]}`}>
          {task.status}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">Deadline: {task.deadline}</p>
        <ArrowRight className="size-4 text-slate-400" />
      </div>
    </article>
  )
}
