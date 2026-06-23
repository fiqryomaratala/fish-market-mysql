// Komponen Loading Skeleton untuk Analytics Dashboard
export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200"></div>
            <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200"></div>
            <div className="h-4 w-96 animate-pulse rounded-full bg-slate-200"></div>
            <div className="h-4 w-80 animate-pulse rounded-full bg-slate-200"></div>
          </div>
          <div className="h-12 w-48 animate-pulse rounded-xl bg-slate-200"></div>
        </div>
      </section>

      {/* Filter Skeleton */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="space-y-4">
          <div className="h-6 w-48 animate-pulse rounded-full bg-slate-200"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-32 animate-pulse rounded-xl bg-slate-200"></div>
            ))}
          </div>
        </div>
      </section>

      {/* KPI Cards Skeleton */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200"></div>
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200"></div>
              </div>
              <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200"></div>
              <div className="h-4 w-48 animate-pulse rounded-full bg-slate-200"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section Skeleton */}
      <section className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 animate-pulse rounded-full bg-slate-200"></div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200"></div>
              </div>
              <div className="h-64 animate-pulse rounded-xl bg-slate-200"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Insights Section Skeleton */}
      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40"
          >
            <div className="space-y-4">
              <div className="h-6 w-40 animate-pulse rounded-full bg-slate-200"></div>
              <div className="h-16 animate-pulse rounded-xl bg-slate-200"></div>
            </div>
          </div>
        ))}
      </section>

      {/* Tables Section Skeleton */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="space-y-4">
          <div className="h-6 w-56 animate-pulse rounded-full bg-slate-200"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-200"></div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}