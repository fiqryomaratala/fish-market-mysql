export function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-xl bg-slate-200" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-xl bg-slate-200" />
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="h-6 w-36 rounded-full bg-slate-200" />
          <div className="h-10 w-3/4 rounded-xl bg-slate-200" />
          <div className="h-8 w-1/3 rounded-xl bg-slate-200" />
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 rounded-xl bg-slate-100" />
            ))}
          </div>
          <div className="h-32 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-12 rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="h-80 rounded-xl bg-white shadow-lg shadow-slate-200/70" />
        <div className="h-80 rounded-xl bg-white shadow-lg shadow-slate-200/70" />
      </div>

      <div className="h-44 rounded-xl bg-slate-200" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-80 rounded-xl bg-white shadow-lg shadow-slate-200/70" />
        ))}
      </div>
    </div>
  )
}
