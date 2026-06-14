import { Search } from 'lucide-react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function SearchBar({
  value,
  onChange,
  label = 'Search',
}: SearchBarProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-600">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-transparent select-none">
        {label}
      </span>
      <span className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-blue-500/70" />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search fish..."
          className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
        />
      </span>
    </label>
  )
}
