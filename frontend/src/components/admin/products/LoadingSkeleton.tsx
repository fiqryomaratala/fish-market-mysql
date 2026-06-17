export function LoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-[90px_1.8fr_1fr_1fr_0.8fr_0.9fr_1fr_120px] gap-4 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Status</span>
        <span>Created</span>
        <span>Action</span>
      </div>

      <div className="space-y-4 p-4 lg:p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid animate-pulse gap-4 rounded-2xl border border-slate-100 p-4 lg:grid-cols-[90px_1.8fr_1fr_1fr_0.8fr_0.9fr_1fr_120px] lg:items-center"
          >
            <div className="h-16 w-20 rounded-xl bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
            </div>
            <div className="h-4 w-20 rounded bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-200" />
            <div className="h-7 w-24 rounded-full bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-9 w-full rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
