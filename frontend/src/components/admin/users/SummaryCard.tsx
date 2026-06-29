interface SummaryCardProps {
  label: string
  value: number
  isLoading?: boolean
}

function SummaryCard({ label, value, isLoading }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-sm shadow-cyan-100/40 ring-1 ring-cyan-100/60">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      {isLoading ? (
        <div className="mt-2 h-8 w-20 animate-pulse rounded bg-slate-200" />
      ) : (
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      )}
    </div>
  )
}

export default SummaryCard
