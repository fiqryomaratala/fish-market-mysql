export function LoadingSkeleton() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30 sm:p-5">
      <div className="animate-pulse space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <div className="h-3 w-28 rounded bg-slate-200" />
              <div className="mt-4 h-8 w-24 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-full rounded bg-slate-200" />
              <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-slate-200">
          <div className="hidden grid-cols-[130px_1fr_1fr_1fr_1fr_110px_160px_120px_120px] gap-4 border-b border-slate-200 px-6 py-4 lg:grid">
            {Array.from({ length: 9 }).map((_, index) => (
              <div key={index} className="h-3 rounded bg-slate-200" />
            ))}
          </div>

          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((__, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      <div className="h-3 w-20 rounded bg-slate-200" />
                      <div className="h-4 w-full rounded bg-slate-200" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
