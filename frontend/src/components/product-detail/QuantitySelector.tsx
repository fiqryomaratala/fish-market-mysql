import { Minus, Plus } from 'lucide-react'

type QuantitySelectorProps = {
  quantity: number
  stock: number
  onDecrease: () => void
  onIncrease: () => void
}

export function QuantitySelector({
  quantity,
  stock,
  onDecrease,
  onIncrease,
}: QuantitySelectorProps) {
  const isDecreaseDisabled = quantity <= 1
  const isIncreaseDisabled = quantity >= stock || stock <= 0

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">Quantity</p>
          <p className="mt-1 text-xs text-slate-500">Maksimal sesuai stok tersedia.</p>
        </div>

        <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={onDecrease}
            disabled={isDecreaseDisabled}
            className="inline-flex size-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-14 text-center text-base font-semibold text-slate-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            disabled={isIncreaseDisabled}
            className="inline-flex size-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
