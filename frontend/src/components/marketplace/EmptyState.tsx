import { FishOff } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/70">
      <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <FishOff className="size-12" />
      </div>
      <h3 className="text-2xl font-semibold text-slate-900">No Product Found</h3>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
        Coba ubah kata kunci pencarian atau reset filter untuk melihat hasil panen yang tersedia.
      </p>
    </div>
  )
}
