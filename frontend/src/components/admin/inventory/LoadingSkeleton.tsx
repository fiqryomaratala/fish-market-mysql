export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-36 animate-pulse rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40"
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/40">
        <div className="hidden grid-cols-[1fr_1.5fr_1fr_0.8fr_0.9fr_0.9fr_1fr_1fr_180px] gap-4 border-b border-slate-100 px-6 py-4 lg:grid">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-4 animate-pulse rounded bg-slate-200" />
          ))}
        </div>
        <div className="space-y-4 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="grid animate-pulse gap-4 rounded-xl border border-slate-100 p-4 lg:grid-cols-[1fr_1.5fr_1fr_0.8fr_0.9fr_0.9fr_1fr_1fr_180px] lg:items-center"
            >
              {Array.from({ length: 9 }).map((_, columnIndex) => (
                <div
                  key={columnIndex}
                  className={`rounded bg-slate-200 ${
                    columnIndex === 8 ? 'h-10 w-full' : 'h-4 w-full'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
