export function LoadingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/70">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-12 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>

      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-52 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-56 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}
