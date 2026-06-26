import { useEffect, useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import type { FishBatch } from '@/types/fish-batch'
import type { Harvest, HarvestMutationInput } from '@/types/harvest'
import { formatNumber } from '@/utils/format'

const harvestFormSchema = z.object({
  fish_batch_id: z.coerce.number().gt(0, 'Batch ikan wajib dipilih'),
  harvest_date: z.string().trim().min(1, 'Tanggal panen wajib diisi'),
  total_quantity: z.coerce.number().gt(0, 'Total quantity harus lebih dari 0'),
  average_weight: z.coerce.number().gt(0, 'Average weight harus lebih dari 0'),
  notes: z.string().trim(),
})

type HarvestFormValues = z.infer<typeof harvestFormSchema>
type HarvestFormInput = z.input<typeof harvestFormSchema>

type HarvestFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  harvest?: Harvest | null
  fishBatches: FishBatch[]
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: HarvestMutationInput) => Promise<void>
}

function getDefaultValues(harvest?: Harvest | null): HarvestFormValues {
  return {
    fish_batch_id: harvest?.fish_batch_id ?? 0,
    harvest_date: harvest?.harvest_date ?? '',
    total_quantity: harvest?.total_quantity ?? 0,
    average_weight: harvest?.average_weight ?? 0,
    notes: harvest?.notes ?? '',
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>
}

export function HarvestFormModal({
  isOpen,
  mode,
  harvest,
  fishBatches,
  isSubmitting,
  onClose,
  onSubmit,
}: HarvestFormModalProps) {
  const {
    control,
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HarvestFormInput, unknown, HarvestFormValues>({
    resolver: zodResolver(harvestFormSchema),
    defaultValues: getDefaultValues(harvest),
  })

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(harvest))
    }
  }, [harvest, isOpen, reset])

  const selectedBatch = useMemo(
    () => fishBatches.find((item) => item.id === Number(watch('fish_batch_id'))),
    [fishBatches, watch],
  )

  const totalQuantity = Number(watch('total_quantity')) || 0
  const averageWeight = Number(watch('average_weight')) || 0
  const totalWeight = totalQuantity * averageWeight
  const survivalRate =
    selectedBatch && selectedBatch.initial_quantity > 0
      ? Math.max(0, Math.min(100, (totalQuantity / selectedBatch.initial_quantity) * 100))
      : 0

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="scrollbar-hidden max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
            {mode === 'create' ? 'Tambah Panen' : 'Ubah Panen'}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            {mode === 'create' ? 'Catat hasil panen baru' : `Perbarui ${harvest?.harvest_code ?? 'data panen'}`}
          </h3>
          <p className="text-sm text-slate-500">
            Pilih batch ikan, masukkan tanggal panen, jumlah panen, dan bobot rata-rata.
          </p>
        </div>

        <form
          className="mt-5 space-y-5"
          onSubmit={handleSubmit(async (values) => {
            if (!selectedBatch) {
              return
            }

            await onSubmit({
              fish_batch_id: values.fish_batch_id,
              harvest_date: values.harvest_date,
              total_quantity: values.total_quantity,
              average_weight: values.average_weight,
              total_weight: values.total_quantity * values.average_weight,
              notes: values.notes,
              batch_code: selectedBatch.batch_code,
              fish_type: selectedBatch.fish_type,
              pond_name: selectedBatch.pond_name,
              initial_quantity: selectedBatch.initial_quantity,
            })
          })}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Batch Ikan</label>
              <Controller
                control={control}
                name="fish_batch_id"
                render={({ field }) => (
                  <DropdownSelect
                    value={String(field.value)}
                    options={[
                      { label: 'Pilih fish batch', value: '0' },
                      ...fishBatches.map((batch) => ({
                        label: `${batch.batch_code} - ${batch.fish_type}`,
                        value: String(batch.id),
                      })),
                    ]}
                    onChange={(value) => field.onChange(Number(value))}
                    ariaLabel="Pilih fish batch"
                    className="mt-2"
                  />
                )}
              />
              <FieldError message={errors.fish_batch_id?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Tanggal Panen</label>
              <input
                type="date"
                {...register('harvest_date')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.harvest_date?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Total Quantity</label>
              <input
                type="number"
                min="0"
                {...register('total_quantity', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.total_quantity?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Bobot Rata-rata (kg)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('average_weight', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.average_weight?.message} />
            </div>
          </div>

          <div className="grid gap-4 rounded-xl border border-slate-100 bg-slate-50/80 p-4 md:grid-cols-2 xl:grid-cols-3">
            <InfoField label="Kode Batch" value={selectedBatch?.batch_code ?? '-'} />
            <InfoField label="Jenis Ikan" value={selectedBatch?.fish_type ?? '-'} />
            <InfoField label="Kolam" value={selectedBatch?.pond_name ?? '-'} />
            <InfoField
              label="Quantity Saat Ini"
              value={selectedBatch ? `${formatNumber(selectedBatch.current_quantity)} ekor` : '-'}
            />
            <InfoField label="Total Bobot" value={`${formatNumber(totalWeight)} kg`} />
            <InfoField label="Survival Rate" value={`${survivalRate.toFixed(1)}%`} />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Notes</label>
            <textarea
              rows={4}
              {...register('notes')}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              placeholder="Tambahkan catatan panen"
            />
            <FieldError message={errors.notes?.message} />
          </div>

          <div className="rounded-xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">
            Formula total weight: <span className="font-semibold">total_quantity x average_weight</span>.
            Formula survival rate:{' '}
            <span className="font-semibold">(total_quantity / initial_quantity) x 100</span>.
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
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
              {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan Panen' : 'Perbarui Panen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}
