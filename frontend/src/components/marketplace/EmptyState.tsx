import { FishOff } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-slate-950/60 px-6 py-12 text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-200">
        <FishOff className="size-12" />
      </div>
      <h3 className="text-2xl font-semibold text-white">No Product Found</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
        Coba ubah kata kunci pencarian atau reset filter untuk melihat hasil panen yang tersedia.
      </p>
    </div>
  )
}
