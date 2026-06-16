function CardSkeleton() {
  return <div className="h-36 animate-pulse rounded-xl bg-slate-200/80" />
}

function PanelSkeleton({ height }: { height: string }) {
  return <div className={`${height} animate-pulse rounded-xl bg-slate-200/80`} />
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PanelSkeleton height="h-28" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <PanelSkeleton height="h-[380px]" />
        <PanelSkeleton height="h-[380px]" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_420px]">
        <PanelSkeleton height="h-[360px]" />
        <PanelSkeleton height="h-[360px]" />
      </div>

      <PanelSkeleton height="h-[380px]" />

      <div className="grid gap-6 xl:grid-cols-2">
        <PanelSkeleton height="h-[320px]" />
        <PanelSkeleton height="h-[320px]" />
      </div>
    </div>
  )
}
