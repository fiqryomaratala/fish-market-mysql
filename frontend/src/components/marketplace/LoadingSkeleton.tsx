export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/70"
        >
          <div className="aspect-[4/3] animate-pulse bg-slate-200" />
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
              <div className="h-4 w-4/6 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-11 animate-pulse rounded-full bg-slate-200" />
              <div className="h-11 animate-pulse rounded-full bg-blue-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
