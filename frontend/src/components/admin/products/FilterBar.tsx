import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Plus, RefreshCcw } from 'lucide-react'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_STATUS_OPTIONS,
  type ProductSortOption,
} from '@/types/product'

type DropdownOption<T extends string> = {
  label: string
  value: T
}

type FilterBarProps = {
  category: string
  status: string
  sort: ProductSortOption
  isRefreshing?: boolean
  onCategoryChange: (value: string) => void
  onStatusChange: (value: string) => void
  onSortChange: (value: ProductSortOption) => void
  onRefresh: () => void
  onAdd: () => void
}

const sortLabelMap: Record<ProductSortOption, string> = {
  newest: 'Terbaru',
  oldest: 'Terlama',
  highest_price: 'Harga Tertinggi',
  lowest_price: 'Harga Terendah',
  stock: 'Stok',
}

const statusLabelMap: Record<string, string> = {
  available: 'Tersedia',
  out_of_stock: 'Stok Habis',
  hidden: 'Disembunyikan',
}

const selectWrapperClassName =
  'relative min-w-0'

const selectBaseClassName =
  'flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 text-left text-sm font-medium text-slate-700 outline-none transition focus-visible:border-slate-300 focus-visible:ring-2 focus-visible:ring-slate-100'

type CustomDropdownProps<T extends string> = {
  value: T
  options: DropdownOption<T>[]
  widthClassName: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onChange: (value: T) => void
}

function CustomDropdown<T extends string>({
  value,
  options,
  widthClassName,
  isOpen,
  onToggle,
  onClose,
  onChange,
}: CustomDropdownProps<T>) {
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const activeOption = options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [isOpen, onClose])

  return (
    <div ref={dropdownRef} className={`${selectWrapperClassName} ${widthClassName}`}>
      <button type="button" onClick={onToggle} className={selectBaseClassName}>
        <span className="truncate">{activeOption?.label}</span>
        <ChevronDown className="ml-3 size-4 shrink-0 text-slate-400" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40">
          <div className="p-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  onClose()
                }}
                className="block w-full cursor-pointer rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function FilterBar({
  category,
  status,
  sort,
  isRefreshing,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onRefresh,
  onAdd,
}: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<'category' | 'status' | 'sort' | null>(null)

  const categoryOptions: DropdownOption<string>[] = [
    { value: 'All', label: 'Semua Kategori' },
    ...PRODUCT_CATEGORIES.map((item) => ({ value: item, label: item })),
  ]

  const statusOptions: DropdownOption<string>[] = [
    { value: 'All', label: 'Semua Status' },
    ...PRODUCT_STATUS_OPTIONS.map((item) => ({
      value: item,
      label: statusLabelMap[item],
    })),
  ]

  const sortOptions: DropdownOption<ProductSortOption>[] = PRODUCT_SORT_OPTIONS.map((item) => ({
    value: item,
    label: sortLabelMap[item],
  }))

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:flex xl:flex-1 xl:flex-wrap">
          <CustomDropdown
            value={category}
            options={categoryOptions}
            widthClassName="xl:w-[180px]"
            isOpen={openDropdown === 'category'}
            onToggle={() =>
              setOpenDropdown((current) => (current === 'category' ? null : 'category'))
            }
            onClose={() => setOpenDropdown(null)}
            onChange={onCategoryChange}
          />

          <CustomDropdown
            value={status}
            options={statusOptions}
            widthClassName="xl:w-[172px]"
            isOpen={openDropdown === 'status'}
            onToggle={() =>
              setOpenDropdown((current) => (current === 'status' ? null : 'status'))
            }
            onClose={() => setOpenDropdown(null)}
            onChange={onStatusChange}
          />

          <CustomDropdown
            value={sort}
            options={sortOptions}
            widthClassName="xl:w-[160px]"
            isOpen={openDropdown === 'sort'}
            onToggle={() => setOpenDropdown((current) => (current === 'sort' ? null : 'sort'))}
            onClose={() => setOpenDropdown(null)}
            onChange={onSortChange}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0">
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700 sm:px-5"
          >
            <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Muat Ulang
          </button>

          <button
            type="button"
            onClick={onAdd}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700 sm:min-w-[168px]"
          >
            <Plus className="size-4" />
            Tambah Produk
          </button>
        </div>
      </div>
    </div>
  )
}
