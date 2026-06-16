export function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="order-card rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-28 animate-pulse rounded-full bg-slate-200" />
              <div className="h-7 w-48 animate-pulse rounded-full bg-slate-200" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((__, cardIndex) => (
              <div
                key={cardIndex}
                className="order-subcard rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-3 h-5 w-full animate-pulse rounded-full bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="mt-4 h-20 animate-pulse rounded-xl bg-slate-100" />
          <div className="mt-5 ml-auto h-11 w-32 animate-pulse rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
