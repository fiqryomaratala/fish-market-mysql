export function LoadingSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/40">
      <div className="hidden grid-cols-[130px_130px_1fr_1fr_140px_120px_140px_140px_140px_180px] gap-4 px-3 py-4 lg:grid">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-4 animate-pulse rounded bg-slate-100" />
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-xl border border-slate-200 p-4">
            <div className="space-y-3">
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-20 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[130px_130px_1fr_1fr_140px_120px_140px_140px_140px_180px] gap-4 border-t border-slate-100 px-3 py-5"
          >
            {Array.from({ length: 10 }).map((_, cellIndex) => (
              <div key={cellIndex} className="h-4 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

