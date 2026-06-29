import { Plus, RefreshCcw, Search } from 'lucide-react'
import { DropdownSelect } from '@/components/common/DropdownSelect'

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
        <DropdownSelect
          value={roleFilter}
          onChange={onRoleChange}
          ariaLabel="Filter role user"
          className="min-w-[220px]"
          options={[
            { label: 'Semua Role', value: 'All' },
            { label: 'Admin', value: 'Admin' },
            { label: 'Staff', value: 'Staff' },
            { label: 'Customer', value: 'Customer' },
          ]}
        />

        <DropdownSelect
          value={statusFilter}
          onChange={onStatusChange}
          ariaLabel="Filter status user"
          className="min-w-[220px]"
          options={[
            { label: 'Semua Status', value: 'All' },
            { label: 'Aktif', value: 'Active' },
            { label: 'Tidak Aktif', value: 'Inactive' },
            { label: 'Ditangguhkan', value: 'Suspended' },
          ]}
        />

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
          className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="size-5" />
          Tambah User
        </button>
      </div>
    </div>
  )
}

export default SearchFilter
