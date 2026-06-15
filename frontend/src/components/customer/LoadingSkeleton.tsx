export function LoadingSkeleton() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_380px]">
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-[1.75rem] bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
        <div className="h-60 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
      </div>
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
        <div className="h-60 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </div>
  )
}
