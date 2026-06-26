import { useEffect, useMemo, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Upload, X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUS_OPTIONS,
  type Product,
  type ProductMutationInput,
  type ProductStatus,
} from '@/types/product'
import { getProductStatusLabel } from './product-status'

const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Nama wajib diisi'),
  description: z.string().trim().optional(),
  price: z.coerce.number().gt(0, 'Harga harus lebih besar dari 0'),
  stock: z.coerce.number().gte(0, 'Stok minimal 0'),
  category: z
    .string()
    .trim()
    .refine((value) => PRODUCT_CATEGORIES.includes(value as (typeof PRODUCT_CATEGORIES)[number]), {
      message: 'Kategori wajib dipilih',
    }),
  weight: z.coerce.number().gte(0, 'Berat minimal 0'),
  status: z.enum(PRODUCT_STATUS_OPTIONS),
  image_url: z.string().trim().optional(),
})

type ProductFormValues = z.infer<typeof productFormSchema>
type ProductFormInput = z.input<typeof productFormSchema>

type ProductFormModalProps = {
  isOpen: boolean
  mode: 'create' | 'edit'
  product?: Product | null
  isSubmitting?: boolean
  onClose: () => void
  onSubmit: (payload: ProductMutationInput) => Promise<void>
}

function getDefaultValues(product?: Product | null): ProductFormValues {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    stock: product?.stock ?? 0,
    category: product?.category ?? '',
    weight: product?.weight ?? 0,
    status: (product?.status as ProductStatus) ?? 'available',
    image_url: product?.image_url ?? '',
  }
}

export function ProductFormModal({
  isOpen,
  mode,
  product,
  isSubmitting,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: getDefaultValues(product),
  })

  const imageUrl = watch('image_url')

  useEffect(() => {
    if (isOpen) {
      reset(getDefaultValues(product))
      setSelectedImage(null)
      setIsDragging(false)
    }
  }, [isOpen, product, reset])

  const previewUrl = useMemo(() => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage)
    }

    return imageUrl || product?.image_url || ''
  }, [imageUrl, product?.image_url, selectedImage])

  useEffect(() => {
    return () => {
      if (selectedImage && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, selectedImage])

  if (!isOpen) {
    return null
  }

  const setImageFile = (file: File | null) => {
    setSelectedImage(file)

    if (file) {
      setValue('image_url', '', { shouldDirty: true })
    }
  }

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      description: values.description ?? '',
      image: selectedImage,
      image_url: selectedImage ? '' : values.image_url?.trim() ?? '',
    })
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="px-6 pt-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              {mode === 'create' ? 'Tambah Produk' : 'Ubah Produk'}
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {mode === 'create' ? 'Tambah produk baru' : `Edit ${product?.name ?? 'produk'}`}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mr-6 mt-6 rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submitHandler} className="flex min-h-0 flex-1 flex-col">
          <div className="scrollbar-hidden min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Informasi Produk
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Nama</span>
                      <input
                        {...register('name')}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                      />
                      {errors.name ? (
                        <p className="text-xs text-red-600">{errors.name.message}</p>
                      ) : null}
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Kategori</span>
                      <Controller
                        control={control}
                        name="category"
                        render={({ field }) => (
                          <DropdownSelect
                            value={field.value}
                            onChange={field.onChange}
                            ariaLabel="Pilih kategori produk"
                            placeholder="Pilih kategori"
                            options={[
                              { label: 'Pilih kategori', value: '' },
                              ...PRODUCT_CATEGORIES.map((item) => ({ label: item, value: item })),
                            ]}
                          />
                        )}
                      />
                      {errors.category ? (
                        <p className="text-xs text-red-600">{errors.category.message}</p>
                      ) : null}
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">Deskripsi</span>
                    <textarea
                      {...register('description')}
                      rows={5}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-slate-700">URL Gambar</span>
                    <input
                      {...register('image_url')}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Status</span>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <DropdownSelect
                            value={field.value}
                            onChange={(value) => field.onChange(value as ProductStatus)}
                            ariaLabel="Pilih status produk"
                            options={PRODUCT_STATUS_OPTIONS.map((statusOption) => ({
                              label: getProductStatusLabel(statusOption),
                              value: statusOption,
                            }))}
                          />
                        )}
                      />
                    </label>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Bagian Gambar
                  </p>
                </div>

                <div className="space-y-4">
                  <div
                    onDragEnter={() => setIsDragging(true)}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => {
                      event.preventDefault()
                      setIsDragging(false)
                      setImageFile(event.dataTransfer.files?.[0] ?? null)
                    }}
                    className={`rounded-3xl border border-dashed p-5 transition ${
                      isDragging
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-slate-300 bg-slate-50/80'
                    }`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                    />

                    <div className="flex flex-col items-center justify-center py-3 text-center">
                      <div className="rounded-2xl bg-white p-3 text-cyan-600">
                        <Upload className="size-6" />
                      </div>
                      <p className="mt-4 text-sm font-semibold text-slate-900">
                        Seret dan lepas gambar di sini
                      </p>
                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        Atau pilih file dari perangkat Anda untuk preview sebelum upload.
                      </p>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
                      >
                        <ImagePlus className="size-4" />
                        Pilih Gambar
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Pratinjau Gambar
                      </p>
                    </div>

                    {previewUrl ? (
                      <div className="bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] p-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-64 w-full object-cover sm:h-72"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-64 flex-col items-center justify-center bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 text-center sm:h-72">
                        <div className="rounded-2xl bg-white p-4 text-slate-400 shadow-sm">
                          <ImagePlus className="size-10" />
                        </div>
                        <p className="mt-4 text-sm font-semibold text-slate-700">
                          Belum ada gambar dipilih
                        </p>
                        <p className="mt-2 max-w-xs text-xs leading-6 text-slate-500">
                          Upload file atau isi URL gambar untuk melihat preview produk di sini.
                        </p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Sumber Terpilih
                        </p>
                        <p className="mt-1 truncate text-sm text-slate-600">
                          {selectedImage?.name || imageUrl || 'Belum ada gambar dipilih'}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null)
                          setValue('image_url', '', { shouldDirty: true })
                          if (inputRef.current) {
                            inputRef.current.value = ''
                          }
                        }}
                        className="inline-flex items-center justify-center rounded-xl border border-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Hapus Gambar
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Harga dan Stok
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Harga</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    {...register('price')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                  {errors.price ? (
                    <p className="text-xs text-red-600">{errors.price.message}</p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Stok</span>
                  <input
                    type="number"
                    min="0"
                    {...register('stock')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                  {errors.stock ? (
                    <p className="text-xs text-red-600">{errors.stock.message}</p>
                  ) : null}
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700">Berat (kg)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    {...register('weight')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                  {errors.weight ? (
                    <p className="text-xs text-red-600">{errors.weight.message}</p>
                  ) : null}
                </label>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {mode === 'create' ? 'Form Produk Baru' : 'Pembaruan Data Produk'}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
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
                  className="rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-cyan-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Menyimpan...'
                    : mode === 'create'
                      ? 'Tambah Produk'
                      : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
