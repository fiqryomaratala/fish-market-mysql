import { useEffect, useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { AlertCircle, Box, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import {
  DeleteModal,
  FilterBar,
  LoadingSkeleton,
  Pagination,
  ProductDetailModal,
  ProductFormModal,
  ProductTable,
  SearchBar,
} from '@/components/admin/products'
import {
  useCreateProduct,
  useDebouncedValue,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from '@/hooks'
import type { Product, ProductMutationInput, ProductSortOption } from '@/types/product'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses permintaan produk.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses permintaan produk.'
}

function sortProducts(products: Product[], sort: ProductSortOption) {
  const items = [...products]

  return items.sort((left, right) => {
    if (sort === 'oldest') {
      return new Date(left.created_at).getTime() - new Date(right.created_at).getTime()
    }

    if (sort === 'highest_price') {
      return right.price - left.price
    }

    if (sort === 'lowest_price') {
      return left.price - right.price
    }

    if (sort === 'stock') {
      return right.stock - left.stock
    }

    return new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
  })
}

function ProductsManagementPage() {
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [sort] = useState<ProductSortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailProductId, setDetailProductId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 350)

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useProducts({
    page: 1,
    limit: 1000,
    search: debouncedSearch || undefined,
    category: category === 'All' ? undefined : category,
    status: status === 'All' ? undefined : status,
  }, { admin: true })

  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  const deleteProductMutation = useDeleteProduct()

  const sortedProducts = useMemo(
    () => sortProducts(data?.items ?? [], sort),
    [data?.items, sort],
  )
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))
  const paginatedProducts = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const startIndex = (safePage - 1) * PAGE_SIZE

    return sortedProducts.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, sortedProducts, totalPages])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch, category, status, sort])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const openCreateModal = () => {
    setFormMode('create')
    setSelectedProduct(null)
    setIsFormOpen(true)
  }

  const openEditModal = (product: Product) => {
    setFormMode('edit')
    setSelectedProduct(product)
    setIsFormOpen(true)
  }

  const handleSubmitProduct = async (payload: ProductMutationInput) => {
    try {
      if (formMode === 'create') {
        await createProductMutation.mutateAsync(payload)
        toast.success('Produk berhasil ditambahkan.')
      } else if (selectedProduct) {
        await updateProductMutation.mutateAsync({ id: selectedProduct.id, payload })
        toast.success('Produk berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedProduct(null)
    } catch (submitError) {
      toast.error(getErrorMessage(submitError))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteProductMutation.mutateAsync(deleteTarget.id)
      toast.success('Produk berhasil dihapus.')
      setDeleteTarget(null)
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError))
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_22%),linear-gradient(135deg,_#f8fdff_0%,_#ffffff_45%,_#f0fdfa_100%)] p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-700">
              Manajemen Produk
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Kelola katalog produk Fish Marketplace
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau stok, harga, kategori, dan status produk dengan alur CRUD yang siap dipakai
              di lingkungan produksi.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Total Produk
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {data?.items.length ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Tersedia
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {data?.items.filter((item) => item.status === 'available').length ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Stok Habis
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {data?.items.filter((item) => item.status === 'out_of_stock').length ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Kontrol Produk Admin
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Atur pencarian dan aksi produk</h2>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <SearchBar
            className="min-w-0 flex-1"
            value={searchInput}
            onChange={setSearchInput}
          />
          <FilterBar
            category={category}
            status={status}
            isRefreshing={isFetching}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
            onRefresh={() => void refetch()}
            onAdd={openCreateModal}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600">
            <p>
              Menampilkan{' '}
              <span className="font-semibold text-slate-900">{sortedProducts.length}</span>{' '}
              produk
            </p>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <p>
              Pencarian realtime:{' '}
              <span className="font-semibold text-cyan-700">
                {debouncedSearch || 'semua produk'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {isLoading ? <LoadingSkeleton /> : null}

      {error ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-red-200 bg-white px-6 py-12 text-center">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat produk</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {getErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
            Coba Lagi
          </button>
        </section>
      ) : null}

      {!isLoading && !error && sortedProducts.length === 0 ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Box className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Produk Tidak Ditemukan</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada produk yang cocok dengan filter saat ini. Coba ubah pencarian, filter,
            atau tambahkan produk baru.
          </p>
        </section>
      ) : null}

      {!isLoading && !error && sortedProducts.length > 0 ? (
        <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-5">
          <ProductTable
            products={paginatedProducts}
            onView={(product) => setDetailProductId(product.id)}
            onEdit={openEditModal}
            onDelete={setDeleteTarget}
          />

          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      ) : null}

      <ProductFormModal
        isOpen={isFormOpen}
        mode={formMode}
        product={selectedProduct}
        isSubmitting={createProductMutation.isPending || updateProductMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedProduct(null)
        }}
        onSubmit={handleSubmitProduct}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        description={`Produk "${deleteTarget?.name ?? ''}" akan dihapus dari katalog. Tindakan ini tidak bisa dibatalkan.`}
        isDeleting={deleteProductMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />

      <ProductDetailModal
        isOpen={detailProductId !== null}
        productId={detailProductId}
        onClose={() => setDetailProductId(null)}
      />
    </div>
  )
}

export default ProductsManagementPage
