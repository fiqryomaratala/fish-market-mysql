import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { Pond } from '@/types/pond'
import {
  FISH_BATCH_STATUS_OPTIONS,
  FISH_TYPE_OPTIONS,
  type FishBatch,
  type FishBatchMutationInput,
} from '@/types/fish-batch'

const fishBatchFormSchema = z
  .object({
    batch_code: z.string().trim().min(1, 'Kode batch wajib diisi'),
    fish_type: z.string().trim().min(1, 'Jenis ikan wajib diisi'),
    pond_id: z.coerce.number().gt(0, 'Kolam wajib dipilih'),
    initial_quantity: z.coerce.number().gt(0, 'Jumlah awal harus lebih dari 0'),
    current_quantity: z.coerce.number().gt(0, 'Jumlah saat ini harus lebih dari 0'),
    average_weight: z.coerce.number().gt(0, 'Bobot rata-rata harus lebih dari 0'),
    stocking_date: z.string().trim().min(1, 'Tanggal tebar wajib diisi'),
    estimated_harvest_date: z.string().trim().min(1, 'Tanggal panen wajib diisi'),
    notes: z.string().trim(),
    status: z.enum(FISH_BATCH_STATUS_OPTIONS),
  })
  .refine((value) => value.estimated_harvest_date >= value.stocking_date, {
    path: ['estimated_harvest_date'],
    message: 'Tanggal panen harus setelah tanggal tebar',
  })

type FishBatchFormValues = z.infer<typeof fishBatchFormSchema>
type FishBatchFormInput = z.input<typeof fishBatchFormSchema>

type FishBatchFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  batch?: FishBatch | null
  ponds: Pond[]
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: FishBatchMutationInput) => Promise<void>
}

function getDefaultValues(batch?: FishBatch | null): FishBatchFormValues {
  return {
    batch_code: batch?.batch_code ?? 'AUTO-GENERATE',
    fish_type: batch?.fish_type ?? 'Nila',
    pond_id: batch?.pond_id ?? 0,
    initial_quantity: batch?.initial_quantity ?? 0,
    current_quantity: batch?.current_quantity ?? 0,
    average_weight: batch?.average_weight ?? 0,
    stocking_date: batch?.stocking_date ?? '',
    estimated_harvest_date: batch?.estimated_harvest_date ?? '',
    notes: batch?.notes ?? '',
    status: batch?.status ?? 'Stocking',
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>
}

export function FishBatchFormModal({
  isOpen,
  mode,
  batch,
  ponds,
  isSubmitting,
  onClose,
  onSubmit,
}: FishBatchFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FishBatchFormInput, unknown, FishBatchFormValues>({
    resolver: zodResolver(fishBatchFormSchema),
    defaultValues: getDefaultValues(batch),
  })

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(batch))
    }
  }, [isOpen, batch, reset])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
            {mode === 'create' ? 'Tambah Batch' : 'Edit Batch'}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            {mode === 'create'
              ? 'Tambah data batch ikan baru'
              : `Perbarui ${batch?.batch_code ?? 'data batch ikan'}`}
          </h3>
          <p className="text-sm text-slate-500">
            Kelola penebaran, perkembangan, dan rencana panen batch ikan langsung dari dashboard.
          </p>
        </div>

        <form className="mt-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Batch Code</label>
              <input
                {...register('batch_code')}
                readOnly
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">Kode batch mengikuti generator dari backend.</p>
              <FieldError message={errors.batch_code?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Fish Type</label>
              <select
                {...register('fish_type')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                {FISH_TYPE_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldError message={errors.fish_type?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Pond</label>
              <select
                {...register('pond_id', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                <option value={0}>Pilih kolam</option>
                {ponds.map((pond) => (
                  <option key={pond.id} value={pond.id}>
                    {pond.name} - {pond.code}
                  </option>
                ))}
              </select>
              <FieldError message={errors.pond_id?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select
                {...register('status')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              >
                {FISH_BATCH_STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldError message={errors.status?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Initial Quantity</label>
              <input
                type="number"
                {...register('initial_quantity', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.initial_quantity?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Current Quantity</label>
              <input
                type="number"
                {...register('current_quantity', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.current_quantity?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Average Weight (kg)</label>
              <input
                type="number"
                step="0.01"
                {...register('average_weight', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.average_weight?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Stocking Date</label>
              <input
                type="date"
                {...register('stocking_date')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.stocking_date?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Estimated Harvest Date</label>
              <input
                type="date"
                {...register('estimated_harvest_date')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.estimated_harvest_date?.message} />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Notes</label>
              <textarea
                {...register('notes')}
                disabled
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />
              <p className="mt-1 text-xs text-slate-400">
                Kolom catatan sudah disiapkan di UI, tetapi endpoint backend saat ini belum menyimpan data ini.
              </p>
            </div>
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
              className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan Batch' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
