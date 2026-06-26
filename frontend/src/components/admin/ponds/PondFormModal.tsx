import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import { POND_STATUS_OPTIONS, type Pond, type PondMutationInput } from '@/types/pond'

const pondFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama kolam wajib diisi'),
  code: z.string().trim().min(1, 'Kode kolam wajib diisi'),
  location: z.string().trim().min(1, 'Lokasi wajib diisi'),
  length: z.coerce.number().gt(0, 'Panjang harus lebih dari 0'),
  width: z.coerce.number().gt(0, 'Lebar harus lebih dari 0'),
  depth: z.coerce.number().gt(0, 'Kedalaman harus lebih dari 0'),
  capacity: z.coerce.number().gt(0, 'Kapasitas harus lebih dari 0'),
  water_source: z.string().trim().min(1, 'Sumber air wajib diisi'),
  status: z.enum(POND_STATUS_OPTIONS),
})

type PondFormValues = z.infer<typeof pondFormSchema>
type PondFormInput = z.input<typeof pondFormSchema>

type PondFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  pond?: Pond | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: PondMutationInput) => Promise<void>
}

function getDefaultValues(pond?: Pond | null): PondFormValues {
  return {
    name: pond?.name ?? '',
    code: pond?.code ?? '',
    location: pond?.location ?? '',
    length: pond?.length ?? 0,
    width: pond?.width ?? 0,
    depth: pond?.depth ?? 0,
    capacity: pond?.capacity ?? 0,
    water_source: pond?.water_source ?? '',
    status: pond?.status ?? 'Active',
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null
  }

  return <p className="mt-1 text-xs font-medium text-red-600">{message}</p>
}

export function PondFormModal({
  isOpen,
  mode,
  pond,
  isSubmitting,
  onClose,
  onSubmit,
}: PondFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PondFormInput, unknown, PondFormValues>({
    resolver: zodResolver(pondFormSchema),
    defaultValues: getDefaultValues(pond),
  })

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(pond))
    }
  }, [isOpen, pond, reset])

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
            {mode === 'create' ? 'Tambah Kolam' : 'Edit Kolam'}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            {mode === 'create' ? 'Tambah data kolam baru' : `Perbarui ${pond?.name ?? 'data kolam'}`}
          </h3>
          <p className="text-sm text-slate-500">
            Lengkapi data kolam untuk kebutuhan operasional dan monitoring budidaya.
          </p>
        </div>

        <form className="mt-5 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-700">Nama Kolam</label>
              <input
                {...register('name')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Kode Kolam</label>
              <input
                {...register('code')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.code?.message} />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Lokasi</label>
              <input
                {...register('location')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.location?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Panjang</label>
              <input
                type="number"
                step="0.01"
                {...register('length', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.length?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Lebar</label>
              <input
                type="number"
                step="0.01"
                {...register('width', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.width?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Kedalaman</label>
              <input
                type="number"
                step="0.01"
                {...register('depth', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.depth?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Kapasitas</label>
              <input
                type="number"
                step="0.01"
                {...register('capacity', { valueAsNumber: true })}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.capacity?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Sumber Air</label>
              <input
                {...register('water_source')}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <FieldError message={errors.water_source?.message} />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <DropdownSelect
                    value={field.value}
                    options={POND_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))}
                    onChange={field.onChange}
                    ariaLabel="Pilih status kolam"
                    className="mt-2"
                  />
                )}
              />
              <FieldError message={errors.status?.message} />
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
              {isSubmitting ? 'Menyimpan...' : mode === 'create' ? 'Simpan Kolam' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
