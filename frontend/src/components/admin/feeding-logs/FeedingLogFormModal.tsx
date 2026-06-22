import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { FishBatch } from '@/types/fish-batch'
import type { FeedingLog, FeedingLogMutationInput } from '@/types/feeding-log'
import type { Inventory } from '@/types/inventory'

const feedingLogFormSchema = z.object({
  fish_batch_id: z.coerce.number().gt(0, 'Batch ikan wajib dipilih'),
  feed_inventory_id: z.coerce.number().gt(0, 'Inventaris pakan wajib dipilih'),
  quantity: z.coerce.number().gt(0, 'Jumlah harus lebih dari 0'),
  feeding_time: z.string().trim().min(1, 'Waktu pakan wajib diisi'),
  notes: z.string().trim(),
})

type FeedingLogFormValues = z.infer<typeof feedingLogFormSchema>
type FeedingLogFormInput = z.input<typeof feedingLogFormSchema>

type FeedingLogFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  log?: FeedingLog | null
  fishBatches: FishBatch[]
  feedInventories: Inventory[]
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: FeedingLogMutationInput) => Promise<void>
}

function toDateTimeLocal(value: string) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function createSyntheticInventory(log?: FeedingLog | null): Inventory | null {
  if (!log?.feed_name) {
    return null
  }

  return {
    id: 900000 + log.id,
    name: log.feed_name,
    category: 'Feed',
    sku: `FEEDING-LOG-${log.id}`,
    unit: 'kg',
    stock: 0,
    minimum_stock: 0,
    status: 'available',
    created_at: '',
    updated_at: '',
  }
}

function getDefaultValues(log?: FeedingLog | null, inventories: Inventory[] = []): FeedingLogFormValues {
  const matchedInventory = inventories.find((item) => item.name === log?.feed_name)

  return {
    fish_batch_id: log?.fish_batch_id ?? 0,
    feed_inventory_id: matchedInventory?.id ?? (log ? 900000 + log.id : 0),
    quantity: log?.quantity ?? 0,
    feeding_time: toDateTimeLocal(log?.feeding_time ?? ''),
    notes: log?.notes ?? '',
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>
}

export function FeedingLogFormModal({
  isOpen,
  mode,
  log,
  fishBatches,
  feedInventories,
  isSubmitting,
  onClose,
  onSubmit,
}: FeedingLogFormModalProps) {
  const inventoryOptions = useMemo(() => {
    const options = [...feedInventories]
    const syntheticInventory = createSyntheticInventory(log)

    if (
      syntheticInventory &&
      !options.some((item) => item.name === syntheticInventory.name)
    ) {
      options.unshift(syntheticInventory)
    }

    return options
  }, [feedInventories, log])

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedingLogFormInput, unknown, FeedingLogFormValues>({
    resolver: zodResolver(feedingLogFormSchema),
    defaultValues: getDefaultValues(log, inventoryOptions),
  })

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(log, inventoryOptions))
    }
  }, [inventoryOptions, isOpen, log, reset])

  const selectedBatch = fishBatches.find((item) => item.id === Number(watch('fish_batch_id')))
  const selectedInventory = inventoryOptions.find((item) => item.id === Number(watch('feed_inventory_id')))

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
            {mode === 'create' ? 'Tambah Log Pakan' : 'Ubah Log Pakan'}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            {mode === 'create'
              ? 'Catat pemberian pakan baru'
              : `Perbarui log pakan ${log?.batch_code ?? ''}`}
          </h3>
          <p className="text-sm text-slate-500">
            Pilih batch ikan, inventaris pakan, jumlah, dan waktu pemberian pakan dari data backend yang tersedia.
          </p>
        </div>

        <form
          className="mt-5 space-y-5"
          onSubmit={handleSubmit(async (values) => {
            const batch = fishBatches.find((item) => item.id === values.fish_batch_id)
            const inventory = inventoryOptions.find((item) => item.id === values.feed_inventory_id)

            if (!batch || !inventory) {
              return
            }

            await onSubmit({
              fish_batch_id: values.fish_batch_id,
              feed_type: inventory.name,
              feed_amount: values.quantity,
              feed_time: new Date(values.feeding_time).toISOString(),
              notes: values.notes,
              batch_code: batch.batch_code,
              fish_type: batch.fish_type,
              pond_name: batch.pond_name,
              feed_name: inventory.name,
            })
          })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Batch Ikan</label>
              <select
                {...register('fish_batch_id', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                <option value={0}>Pilih batch ikan</option>
                {fishBatches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.batch_code} - {batch.fish_type} - {batch.pond_name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.fish_batch_id?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Inventaris Pakan</label>
              <select
                {...register('feed_inventory_id', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                <option value={0}>Pilih inventaris pakan</option>
                {inventoryOptions.map((inventory) => (
                  <option key={inventory.id} value={inventory.id}>
                    {inventory.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.feed_inventory_id?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Jumlah</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('quantity', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.quantity?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Waktu Pakan</label>
              <input
                type="datetime-local"
                {...register('feeding_time')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.feeding_time?.message} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Stok Saat Ini</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {selectedInventory ? selectedInventory.stock : '-'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Stok saat ini untuk pakan yang dipilih dari endpoint inventory.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Satuan</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {selectedInventory?.unit || '-'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Satuan inventaris yang akan membantu validasi operasional.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Catatan</label>
              <textarea
                rows={4}
                {...register('notes')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="Tambahkan catatan pemberian pakan bila diperlukan"
              />
            </div>
          </div>

          {selectedBatch ? (
            <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-900">
              Batch terpilih: <span className="font-semibold">{selectedBatch.batch_code}</span> untuk ikan{' '}
              <span className="font-semibold">{selectedBatch.fish_type}</span> di{' '}
              <span className="font-semibold">{selectedBatch.pond_name}</span>.
            </div>
          ) : null}

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
              className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Menyimpan...'
                : mode === 'create'
                  ? 'Simpan Log Pakan'
                  : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
