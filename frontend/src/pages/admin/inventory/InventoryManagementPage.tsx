import { useEffect, useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import {
  AlertCircle,
  Boxes,
  PackageX,
  RefreshCcw,
  Search,
  ShieldAlert,
  Tags,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DeleteModal,
  InventoryDetailModal,
  InventoryFormModal,
  InventoryMovementTable,
  InventoryTable,
  LoadingSkeleton,
  LowStockAlert,
  StockAdjustmentModal,
  SummaryCard,
} from '@/components/admin/inventory'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import { Pagination } from '@/components/admin/products'
import {
  useAdjustStock,
  useAuth,
  useCreateInventory,
  useDebouncedValue,
  useDeleteInventory,
  useInventories,
  useInventoryMovements,
  useRecordOperationalTransaction,
  useUpdateInventory,
} from '@/hooks'
import {
  INVENTORY_CATEGORIES,
  type Inventory,
  type InventoryAdjustmentInput,
  type InventoryMutationInput,
  type InventoryOperationalTransactionInput,
  type InventoryStockTransactionInput,
} from '@/types/inventory'
import { formatNumber } from '@/utils/format'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses inventaris.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses inventaris.'
}

function InventoryManagementPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'
  const canManage = isAdmin
  const canOperate = role === 'admin' || role === 'staff'
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null)
  const [detailInventoryId, setDetailInventoryId] = useState<number | null>(null)
  const [adjustInventory, setAdjustInventory] = useState<Inventory | null>(null)
  const [deleteInventoryTarget, setDeleteInventoryTarget] = useState<Inventory | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const inventoriesQuery = useInventories({ page: 1, limit: 1000 })
  const movementsQuery = useInventoryMovements()
  const createInventoryMutation = useCreateInventory()
  const updateInventoryMutation = useUpdateInventory()
  const deleteInventoryMutation = useDeleteInventory()
  const adjustStockMutation = useAdjustStock()
  const operationalTransactionMutation = useRecordOperationalTransaction()

  const filteredInventories = useMemo(() => {
    return (inventoriesQuery.data?.items ?? []).filter((item) => {
      const matchesSearch =
        debouncedSearch.length === 0 ||
        item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = category === 'All' || item.category === category
      const matchesStatus = status === 'All' || item.status === status

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [category, debouncedSearch, inventoriesQuery.data?.items, status])

  const totalPages = Math.max(1, Math.ceil(filteredInventories.length / PAGE_SIZE))
  const paginatedInventories = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    return filteredInventories.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredInventories, totalPages])

  const lowStockItems = useMemo(
    () => (inventoriesQuery.data?.items ?? []).filter((item) => item.stock <= item.minimum_stock),
    [inventoriesQuery.data?.items],
  )

  const summary = useMemo(() => {
    const items = inventoriesQuery.data?.items ?? []

    return {
      totalInventory: items.length,
      lowStockItems: items.filter((item) => item.stock > 0 && item.stock <= item.minimum_stock).length,
      outOfStock: items.filter((item) => item.stock <= 0).length,
      totalCategories: new Set(items.map((item) => item.category)).size,
    }
  }, [inventoriesQuery.data?.items])

  useEffect(() => {
    setCurrentPage(1)
  }, [category, debouncedSearch, status])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleOpenCreate = () => {
    if (!canManage) {
      toast.error('Aksi ini hanya tersedia untuk admin.')
      return
    }

    setFormMode('create')
    setSelectedInventory(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (inventory: Inventory) => {
    if (!canManage) {
      toast.error('Aksi ini hanya tersedia untuk admin.')
      return
    }

    setFormMode('edit')
    setSelectedInventory(inventory)
    setIsFormOpen(true)
  }

  const handleOpenAdjust = (inventory: Inventory) => {
    if (!canOperate) {
      toast.error('Anda tidak memiliki akses untuk transaksi stok.')
      return
    }

    setAdjustInventory(inventory)
  }

  const handleSubmitInventory = async (payload: InventoryMutationInput) => {
    try {
      if (formMode === 'create') {
        await createInventoryMutation.mutateAsync(payload)
        toast.success('Inventaris berhasil ditambahkan.')
      } else if (selectedInventory) {
        await updateInventoryMutation.mutateAsync({ id: selectedInventory.id, payload })
        toast.success('Inventaris berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedInventory(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleSubmitAdjustment = async (payload: InventoryStockTransactionInput) => {
    try {
      if (isAdmin) {
        await adjustStockMutation.mutateAsync(payload as InventoryAdjustmentInput)
        toast.success('Penyesuaian stok berhasil disimpan.')
      } else {
        await operationalTransactionMutation.mutateAsync(payload as InventoryOperationalTransactionInput)
        toast.success('Transaksi operasional berhasil disimpan.')
      }
      setAdjustInventory(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDeleteInventory = async () => {
    if (!deleteInventoryTarget) {
      return
    }

    try {
      await deleteInventoryMutation.mutateAsync(deleteInventoryTarget.id)
      toast.success('Inventaris berhasil dihapus.')
      setDeleteInventoryTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const isLoading = inventoriesQuery.isLoading || movementsQuery.isLoading
  const hasError = inventoriesQuery.isError || movementsQuery.isError
  const isRefreshing = inventoriesQuery.isFetching || movementsQuery.isFetching

  if (role !== 'admin' && role !== 'staff') {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="admin-page-hero rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Inventory Management
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Kelola stok inventaris operasional
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau ketersediaan stok, histori pergerakan, dan lakukan penyesuaian inventaris dari
              satu halaman yang rapi, responsif, dan siap dipakai di lingkungan produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {canManage
              ? 'Mode admin aktif. Anda bisa menambah, mengedit, menyesuaikan, dan menghapus inventaris.'
              : 'Mode staff aktif. Anda bisa memantau stok, melihat riwayat pergerakan, dan mencatat transaksi operasional.'}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Inventory"
          value={formatNumber(summary.totalInventory)}
          description="Jumlah item inventaris yang sedang termuat dari backend."
          icon={Boxes}
          tone="cyan"
        />
        <SummaryCard
          title="Low Stock Items"
          value={formatNumber(summary.lowStockItems)}
          description="Item yang stoknya sudah mendekati atau menyentuh batas minimum."
          icon={ShieldAlert}
          tone="amber"
        />
        <SummaryCard
          title="Out Of Stock"
          value={formatNumber(summary.outOfStock)}
          description="Item inventaris yang saat ini tidak memiliki stok tersedia."
          icon={PackageX}
          tone="slate"
        />
        <SummaryCard
          title="Total Categories"
          value={formatNumber(summary.totalCategories)}
          description="Kategori inventaris aktif yang terdeteksi pada data backend."
          icon={Tags}
          tone="emerald"
        />
      </section>

      <LowStockAlert
        items={lowStockItems}
        onOpenAdjust={handleOpenAdjust}
        canAdjust={canOperate}
        actionLabel={isAdmin ? 'Sesuaikan Stok' : 'Catat Transaksi'}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari nama inventaris atau SKU"
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <DropdownSelect
                value={category}
                onChange={setCategory}
                ariaLabel="Filter kategori inventaris"
                className="min-w-[220px]"
                options={[
                  { label: 'Semua kategori', value: 'All' },
                  ...INVENTORY_CATEGORIES.map((item) => ({ label: item, value: item })),
                ]}
              />

              <DropdownSelect
                value={status}
                onChange={setStatus}
                ariaLabel="Filter status inventaris"
                className="min-w-[220px]"
                options={[
                  { label: 'Semua status', value: 'All' },
                  { label: 'Available', value: 'available' },
                  { label: 'Low Stock', value: 'low_stock' },
                  { label: 'Out Of Stock', value: 'out_of_stock' },
                ]}
              />

              <button
                type="button"
                onClick={() => {
                  void inventoriesQuery.refetch()
                  void movementsQuery.refetch()
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-700"
              >
                <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                disabled={!canManage}
                className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add Inventory
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-slate-600">
              Menampilkan <span className="font-semibold text-slate-900">{filteredInventories.length}</span>{' '}
              item inventaris
            </p>
            <p className="text-slate-500">
              Filter aktif:{' '}
              <span className="font-semibold text-cyan-700">
                {debouncedSearch || category !== 'All' || status !== 'All'
                  ? [debouncedSearch || null, category !== 'All' ? category : null, status !== 'All' ? status : null]
                      .filter(Boolean)
                      .join(' • ')
                  : 'semua data'}
              </span>
            </p>
          </div>
        </div>
      </section>

      {isLoading ? <LoadingSkeleton /> : null}

      {!isLoading && hasError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat inventaris</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {getErrorMessage(inventoriesQuery.error || movementsQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => {
              void inventoriesQuery.refetch()
              void movementsQuery.refetch()
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </section>
      ) : null}

      {!isLoading && !hasError && filteredInventories.length === 0 ? (
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Boxes className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">No Inventory Found</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada inventaris yang cocok dengan pencarian dan filter saat ini.
          </p>
        </section>
      ) : null}

      {!isLoading && !hasError && filteredInventories.length > 0 ? (
        <section className="space-y-4">
          <InventoryTable
            inventories={paginatedInventories}
            canManage={canManage}
            canAdjust={canOperate}
            adjustLabel={isAdmin ? 'Sesuaikan' : 'Transaksi'}
            onView={(inventory) => setDetailInventoryId(inventory.id)}
            onEdit={handleOpenEdit}
            onAdjust={handleOpenAdjust}
            onDelete={(inventory) => {
              if (!canManage) {
                toast.error('Aksi ini hanya tersedia untuk admin.')
                return
              }

              setDeleteInventoryTarget(inventory)
            }}
          />

          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      ) : null}

      {!isLoading && !hasError && (movementsQuery.data?.length ?? 0) > 0 ? (
        <InventoryMovementTable movements={movementsQuery.data ?? []} />
      ) : null}

      <InventoryFormModal
        isOpen={isFormOpen}
        mode={formMode}
        inventory={selectedInventory}
        isSubmitting={createInventoryMutation.isPending || updateInventoryMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedInventory(null)
        }}
        onSubmit={handleSubmitInventory}
      />

      <InventoryDetailModal
        isOpen={detailInventoryId !== null}
        inventoryId={detailInventoryId}
        onClose={() => setDetailInventoryId(null)}
      />

      <StockAdjustmentModal
        isOpen={Boolean(adjustInventory)}
        inventory={adjustInventory}
        mode={isAdmin ? 'adjustment' : 'operational'}
        isSubmitting={adjustStockMutation.isPending || operationalTransactionMutation.isPending}
        onClose={() => setAdjustInventory(null)}
        onSubmit={handleSubmitAdjustment}
      />

      <DeleteModal
        isOpen={Boolean(deleteInventoryTarget)}
        description={`Item inventaris "${deleteInventoryTarget?.name ?? ''}" akan dihapus permanen dari sistem.`}
        isDeleting={deleteInventoryMutation.isPending}
        onClose={() => setDeleteInventoryTarget(null)}
        onConfirm={() => void handleDeleteInventory()}
      />
    </div>
  )
}

export default InventoryManagementPage
