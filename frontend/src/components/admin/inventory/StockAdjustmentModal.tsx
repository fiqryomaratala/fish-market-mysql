import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import type { Inventory, InventoryStockTransactionInput } from '@/types/inventory'
import { formatNumber } from '@/utils/format'

const stockAdjustmentSchema = z.object({
  type: z.enum(['stock_in', 'stock_out']),
  quantity: z.coerce.number().gt(0, 'Quantity harus lebih besar dari 0'),
  reason: z.string().trim().min(1, 'Alasan wajib diisi'),
  reference: z.string().trim().optional(),
})

type StockAdjustmentValues = z.infer<typeof stockAdjustmentSchema>
type StockAdjustmentInput = z.input<typeof stockAdjustmentSchema>

type StockAdjustmentModalProps = {
  isOpen: boolean
  inventory?: Inventory | null
  mode?: 'adjustment' | 'operational'
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: InventoryStockTransactionInput) => Promise<void>
}

export function StockAdjustmentModal({
  isOpen,
  inventory,
  mode = 'adjustment',
  isSubmitting,
  onClose,
  onSubmit,
}: StockAdjustmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<StockAdjustmentInput, unknown, StockAdjustmentValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      type: 'stock_in',
      quantity: 1,
      reason: '',
      reference: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        type: 'stock_in',
        quantity: 1,
        reason: '',
        reference: '',
      })
    }
  }, [isOpen, reset])

  const adjustmentType = useWatch({ control, name: 'type' })

  if (!isOpen || !inventory) {
    return null
  }
  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      inventory_id: inventory.id,
      type: values.type,
      quantity: values.quantity,
      reason: values.reason,
      reference: values.reference,
    })
  })
  const isOperationalMode = mode === 'operational'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-300/40">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              {isOperationalMode ? 'Transaksi Operasional' : 'Penyesuaian Stok'}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">{inventory.name}</h3>
            <p className="mt-1 text-sm text-slate-500">
              {isOperationalMode
                ? `Catat stok masuk atau keluar untuk operasional harian. Stok saat ini ${formatNumber(inventory.stock)} ${inventory.unit}`
                : `Stok saat ini ${formatNumber(inventory.stock)} ${inventory.unit}`}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submitHandler} className="space-y-6 px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label
              className={`rounded-xl border px-4 py-4 transition ${
                adjustmentType === 'stock_in'
                  ? 'border-cyan-200 bg-cyan-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <input type="radio" value="stock_in" {...register('type')} className="sr-only" />
              <span className="text-sm font-semibold text-slate-900">Stock In</span>
              <p className="mt-1 text-sm text-slate-500">
                {isOperationalMode ? 'Catat stok masuk dari aktivitas operasional.' : 'Tambahkan stok ke inventaris.'}
              </p>
            </label>

            <label
              className={`rounded-xl border px-4 py-4 transition ${
                adjustmentType === 'stock_out'
                  ? 'border-cyan-200 bg-cyan-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <input type="radio" value="stock_out" {...register('type')} className="sr-only" />
              <span className="text-sm font-semibold text-slate-900">Stock Out</span>
              <p className="mt-1 text-sm text-slate-500">
                {isOperationalMode ? 'Catat stok keluar untuk kebutuhan operasional.' : 'Kurangi stok dari inventaris.'}
              </p>
            </label>
          </div>

          <div className={`grid gap-4 ${isOperationalMode ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Quantity</span>
              <input
                type="number"
                min="1"
                {...register('quantity')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.quantity ? (
                <p className="text-xs text-red-600">{errors.quantity.message}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Alasan</span>
              <input
                {...register('reason')}
                placeholder={
                  isOperationalMode
                    ? 'Contoh: distribusi pakan, penerimaan stok, kebutuhan kolam'
                    : 'Contoh: stok opname, barang masuk, barang rusak'
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.reason ? (
                <p className="text-xs text-red-600">{errors.reason.message}</p>
              ) : null}
            </label>

            {isOperationalMode ? (
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Referensi</span>
                <input
                  {...register('reference')}
                  placeholder="Contoh: OPS-2026-0001"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
                <p className="text-xs text-slate-500">Opsional, untuk jejak transaksi operasional.</p>
              </label>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : isOperationalMode
                  ? 'Simpan Transaksi'
                  : 'Simpan Penyesuaian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
