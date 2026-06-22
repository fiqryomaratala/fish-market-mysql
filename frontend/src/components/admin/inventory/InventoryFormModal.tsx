import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  INVENTORY_CATEGORIES,
  type Inventory,
  type InventoryMutationInput,
} from '@/types/inventory'

const inventoryFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi'),
  sku: z.string().trim().min(1, 'SKU wajib diisi'),
  category: z
    .string()
    .trim()
    .refine(
      (value) => INVENTORY_CATEGORIES.includes(value as (typeof INVENTORY_CATEGORIES)[number]),
      'Kategori wajib dipilih',
    ),
  unit: z.string().trim().min(1, 'Unit wajib diisi'),
  stock: z.coerce.number().gte(0, 'Stok minimal 0'),
  minimum_stock: z.coerce.number().gte(0, 'Stok minimum minimal 0'),
})

type InventoryFormValues = z.infer<typeof inventoryFormSchema>
type InventoryFormInput = z.input<typeof inventoryFormSchema>

type InventoryFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  inventory?: Inventory | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: InventoryMutationInput) => Promise<void>
}

function getDefaultValues(inventory?: Inventory | null): InventoryFormValues {
  return {
    name: inventory?.name ?? '',
    sku: inventory?.sku ?? '',
    category: (inventory?.category as InventoryFormValues['category']) ?? 'Fish',
    unit: inventory?.unit ?? 'kg',
    stock: inventory?.stock ?? 0,
    minimum_stock: inventory?.minimum_stock ?? 0,
  }
}

export function InventoryFormModal({
  isOpen,
  mode,
  inventory,
  isSubmitting,
  onClose,
  onSubmit,
}: InventoryFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormInput, unknown, InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: getDefaultValues(inventory),
  })

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(inventory))
    }
  }, [inventory, isOpen, reset])

  if (!isOpen) {
    return null
  }

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values)
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-300/40">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
              {mode === 'create' ? 'Tambah Inventaris' : 'Edit Inventaris'}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {mode === 'create'
                ? 'Tambah item inventaris baru'
                : `Perbarui ${inventory?.name ?? 'item inventaris'}`}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submitHandler} className="space-y-6 overflow-y-auto px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Nama</span>
              <input
                {...register('name')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">SKU</span>
              <input
                {...register('sku')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.sku ? <p className="text-xs text-red-600">{errors.sku.message}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Kategori</span>
              <select
                {...register('category')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                {INVENTORY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category ? (
                <p className="text-xs text-red-600">{errors.category.message}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Unit</span>
              <input
                {...register('unit')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.unit ? <p className="text-xs text-red-600">{errors.unit.message}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Stok Saat Ini</span>
              <input
                type="number"
                min="0"
                {...register('stock')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.stock ? <p className="text-xs text-red-600">{errors.stock.message}</p> : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Stok Minimum</span>
              <input
                type="number"
                min="0"
                {...register('minimum_stock')}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              {errors.minimum_stock ? (
                <p className="text-xs text-red-600">{errors.minimum_stock.message}</p>
              ) : null}
            </label>
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
                : mode === 'create'
                  ? 'Tambah Inventaris'
                  : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
