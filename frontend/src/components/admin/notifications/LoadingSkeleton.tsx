export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-32 rounded-xl border border-slate-200 bg-slate-100 shadow-lg"
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.7fr))]">
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-100" />
          <div className="h-12 rounded-xl bg-slate-100" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg"
          >
            <div className="flex gap-4">
              <div className="size-12 rounded-xl bg-slate-100" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 rounded bg-slate-100" />
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-3/4 rounded bg-slate-100" />
                <div className="h-4 w-28 rounded bg-slate-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
