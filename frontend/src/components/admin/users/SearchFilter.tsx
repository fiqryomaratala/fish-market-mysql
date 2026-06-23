import { Plus, RefreshCcw, Search } from 'lucide-react'

interface SearchFilterProps {
  searchValue: string
  roleFilter: string
  statusFilter: string
  isRefreshing: boolean
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onRefresh: () => void
  onAdd: () => void
}

function SearchFilter({
  searchValue,
  roleFilter,
  statusFilter,
  isRefreshing,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onRefresh,
  onAdd,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari berdasarkan nama, email, atau telepon..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="All">Semua Role</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="Customer">Customer</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        >
          <option value="All">Semua Status</option>
          <option value="Active">Aktif</option>
          <option value="Inactive">Tidak Aktif</option>
          <option value="Suspended">Ditangguhkan</option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw className={`size-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="ml-auto flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
        >
          <Plus className="size-5" />
          Tambah User
        </button>
      </div>
    </div>
  )
}

export default SearchFilter
