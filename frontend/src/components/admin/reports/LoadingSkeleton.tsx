export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30"
          >
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="mt-4 h-8 w-32 rounded bg-slate-200" />
            <div className="mt-5 h-4 w-full rounded bg-slate-100" />
            <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
        <div className="h-5 w-40 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-72 rounded bg-slate-200" />
        <div className="mt-6 h-[320px] rounded-xl bg-slate-100" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/30">
        <div className="h-5 w-36 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-64 rounded bg-slate-200" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  )
}
