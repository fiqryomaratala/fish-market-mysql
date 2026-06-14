import { SlidersHorizontal } from 'lucide-react'

type PriceRangeFilterProps = {
  minPrice: string
  maxPrice: string
  onChange: (nextValue: { minPrice: string; maxPrice: string }) => void
}

type PriceInputProps = {
  id: string
  label: string
  placeholder: string
  value: string
  onValueChange: (value: string) => void
}

function PriceInput({
  id,
  label,
  placeholder,
  value,
  onValueChange,
}: PriceInputProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400 transition-all duration-200 ease-in-out">
          Rp
        </span>
        <input
          id={id}
          type="number"
          min="0"
          inputMode="numeric"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          className="price-range-input h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 hover:border-blue-400 hover:shadow-[0_4px_12px_rgba(59,130,246,0.08)] focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </span>
    </label>
  )
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
        <SlidersHorizontal className="size-4 text-blue-600" />
        Price Range
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceInput
          id="marketplace-min-price"
          label="Minimum"
          placeholder="Min"
          value={minPrice}
          onValueChange={(value) => onChange({ minPrice: value, maxPrice })}
        />
        <PriceInput
          id="marketplace-max-price"
          label="Maximum"
          placeholder="Max"
          value={maxPrice}
          onValueChange={(value) => onChange({ minPrice, maxPrice: value })}
        />
      </div>
    </section>
  )
}
