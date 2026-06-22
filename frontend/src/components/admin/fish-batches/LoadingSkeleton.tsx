export function LoadingSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30 sm:p-5">
      <div className="hidden grid-cols-[140px_1fr_1fr_0.9fr_0.9fr_0.9fr_1fr_1fr_0.9fr_120px] gap-4 px-2 pb-4 lg:grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-4 animate-pulse rounded bg-slate-100" />
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-100 p-4"
          >
            <div className="grid gap-3">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, innerIndex) => (
                  <div key={innerIndex} className="h-4 animate-pulse rounded bg-slate-100" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
