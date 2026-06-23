export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/30"
          />
        ))}
      </section>

      <section className="h-44 animate-pulse rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/30" />

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </section>
    </div>
  )
}
