export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl border border-slate-200 bg-slate-100"
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-8 w-48 rounded bg-slate-200" />
          <div className="h-10 w-32 rounded-lg bg-slate-200" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg border border-slate-200 bg-slate-50"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
