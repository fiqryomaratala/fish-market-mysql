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
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-500/70 transition-all duration-200 ease-in-out">
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
          className="price-range-input h-14 w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
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
    <section className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(239,246,255,0.72)_100%)] p-4 shadow-sm shadow-slate-200/70">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <SlidersHorizontal className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
              Filter Harga
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-900">Rentang Harga</h3>
          </div>
        </div>
        <p className="text-sm leading-6 text-slate-500">
          Tentukan batas harga agar hasil produk lebih relevan.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PriceInput
          id="marketplace-min-price"
          label="Minimal"
          placeholder="Min"
          value={minPrice}
          onValueChange={(value) => onChange({ minPrice: value, maxPrice })}
        />
        <PriceInput
          id="marketplace-max-price"
          label="Maksimal"
          placeholder="Maks"
          value={maxPrice}
          onValueChange={(value) => onChange({ minPrice, maxPrice: value })}
        />
      </div>
    </section>
  )
}
