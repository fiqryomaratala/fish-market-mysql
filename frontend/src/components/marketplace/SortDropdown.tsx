type SortDropdownProps = {
  value: string
  options: string[]
  onChange: (value: string) => void
  label?: string
}

export function SortDropdown({
  value,
  options,
  onChange,
  label = 'Sort By',
}: SortDropdownProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-300">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
