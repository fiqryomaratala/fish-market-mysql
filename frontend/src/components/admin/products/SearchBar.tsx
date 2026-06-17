import { Search } from 'lucide-react'

type SearchBarProps = {
  className?: string
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ className = '', value, onChange }: SearchBarProps) {
  return (
    <label className={`relative block ${className}`}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari nama atau deskripsi produk..."
        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
      />
    </label>
  )
}
