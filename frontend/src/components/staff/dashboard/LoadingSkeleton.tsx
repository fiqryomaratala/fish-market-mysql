function SkeletonCard() {
  return <div className="h-40 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-52 animate-pulse rounded-[1.75rem] bg-slate-200/80" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-96 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-80 animate-pulse rounded-[1.5rem] bg-slate-200/70" />
        ))}
      </div>
    </div>
  )
}
