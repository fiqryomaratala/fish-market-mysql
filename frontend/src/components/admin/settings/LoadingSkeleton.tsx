export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="h-5 w-40 rounded bg-slate-100" />
        <div className="mt-4 h-8 w-64 rounded bg-slate-100" />
        <div className="mt-3 h-4 w-96 rounded bg-slate-100" />
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-4 w-24 rounded bg-slate-100" />
                <div className="mt-3 h-7 w-16 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
              </div>
              <div className="size-12 rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Settings panel skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg lg:col-span-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="h-10 w-full rounded-lg bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg lg:col-span-3">
          <div className="h-6 w-48 rounded bg-slate-100" />
          <div className="mt-6 space-y-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-slate-100" />
                  <div className="mt-1 h-3 w-48 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-16 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="mt-8 h-10 w-32 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  )
}