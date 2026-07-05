import { useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { AlertCircle, Fish, Package, RefreshCcw, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Pagination } from '@/components/admin/products'
import {
  DeleteModal,
  FishBatchDetailModal,
  FishBatchFormModal,
  FishBatchSummaryCard,
  FishBatchTable,
  LoadingSkeleton,
  SearchFilter,
} from '@/components/admin/fish-batches'
import {
  useAuth,
  useCreateFishBatch,
  useDebouncedValue,
  useDeleteFishBatch,
  useFishBatches,
  usePonds,
  useUpdateFishBatch,
} from '@/hooks'
import type { FishBatch, FishBatchMutationInput, FishBatchStatus } from '@/types/fish-batch'
import { getFishBatchStatusLabel } from '@/types/fish-batch'
import { formatNumber } from '@/utils/format'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses data batch ikan.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses data batch ikan.'
}

function FishBatchesManagementPage() {
  const { role } = useAuth()
  const canManage = role === 'admin' || role === 'staff'
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState<FishBatchStatus | 'All'>('All')
  const [fishType, setFishType] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedBatch, setSelectedBatch] = useState<FishBatch | null>(null)
  const [detailBatchId, setDetailBatchId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FishBatch | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const fishBatchesQuery = useFishBatches({ page: 1, limit: 1000 })
  const pondsQuery = usePonds({ page: 1, limit: 1000 })
  const createFishBatchMutation = useCreateFishBatch()
  const updateFishBatchMutation = useUpdateFishBatch()
  const deleteFishBatchMutation = useDeleteFishBatch()

  const filteredBatches = useMemo(() => {
    return (fishBatchesQuery.data?.items ?? []).filter((batch) => {
      const keyword = debouncedSearch.toLowerCase()
      const matchesSearch =
        keyword.length === 0 ||
        batch.batch_code.toLowerCase().includes(keyword) ||
        batch.fish_type.toLowerCase().includes(keyword) ||
        batch.pond_name.toLowerCase().includes(keyword)
      const matchesStatus = status === 'All' || batch.status === status
      const matchesFishType = fishType === 'All' || batch.fish_type === fishType

      return matchesSearch && matchesStatus && matchesFishType
    })
  }, [debouncedSearch, fishBatchesQuery.data?.items, fishType, status])

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedBatches = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE

    return filteredBatches.slice(start, start + PAGE_SIZE)
  }, [filteredBatches, safeCurrentPage])

  const summary = useMemo(() => {
    const items = fishBatchesQuery.data?.items ?? []

    return {
      totalBatch: items.length,
      growingBatch: items.filter((item) => item.status === 'Growing').length,
      readyToHarvest: items.filter((item) => item.status === 'Ready To Harvest').length,
      harvestedBatch: items.filter((item) => item.status === 'Harvested').length,
    }
  }, [fishBatchesQuery.data?.items])

  const handleOpenCreate = () => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk menambah batch ikan.')
      return
    }

    setFormMode('create')
    setSelectedBatch(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (batch: FishBatch) => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk mengubah batch ikan.')
      return
    }

    setFormMode('edit')
    setSelectedBatch(batch)
    setIsFormOpen(true)
  }

  const handleDeletePrompt = (batch: FishBatch) => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk menghapus batch ikan.')
      return
    }

    setDeleteTarget(batch)
  }

  const handleSubmitFishBatch = async (payload: FishBatchMutationInput) => {
    try {
      if (formMode === 'create') {
        const createdBatch = await createFishBatchMutation.mutateAsync(payload)
        const requiresFollowUpUpdate =
          payload.current_quantity !== payload.initial_quantity || payload.status !== 'Growing'

        if (requiresFollowUpUpdate) {
          await updateFishBatchMutation.mutateAsync({
            id: createdBatch.id,
            payload,
          })
        }

        toast.success('Batch ikan berhasil ditambahkan.')
      } else if (selectedBatch) {
        await updateFishBatchMutation.mutateAsync({ id: selectedBatch.id, payload })
        toast.success('Batch ikan berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedBatch(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteFishBatchMutation.mutateAsync(deleteTarget.id)
      toast.success('Batch ikan berhasil dihapus.')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (role !== 'admin' && role !== 'staff') {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="admin-page-hero rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Manajemen Batch Ikan
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Kelola batch ikan secara terpusat dan responsif
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau kode batch, jenis ikan, kolam, jumlah tebar, perkembangan pertumbuhan, dan
              estimasi panen dalam satu halaman dashboard yang siap produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Mode akses {role === 'admin' ? 'admin' : 'staff'} aktif untuk monitoring dan pengelolaan batch ikan.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FishBatchSummaryCard
          title="Total Batch"
          value={formatNumber(summary.totalBatch)}
          description="Jumlah seluruh batch ikan yang berhasil dimuat dari backend."
          icon={Package}
          tone="cyan"
        />
        <FishBatchSummaryCard
          title="Batch Pertumbuhan"
          value={formatNumber(summary.growingBatch)}
          description="Batch yang sedang berada pada fase pertumbuhan aktif."
          icon={TrendingUp}
          tone="emerald"
        />
        <FishBatchSummaryCard
          title="Siap Panen"
          value={formatNumber(summary.readyToHarvest)}
          description="Batch yang sudah mendekati atau siap masuk jadwal panen."
          icon={Fish}
          tone="orange"
        />
        <FishBatchSummaryCard
          title="Batch Dipanen"
          value={formatNumber(summary.harvestedBatch)}
          description="Batch yang sudah selesai dipanen dan tercatat dalam sistem."
          icon={Package}
          tone="slate"
        />
      </section>

      <SearchFilter
        search={searchInput}
        status={status}
        fishType={fishType}
        isRefreshing={fishBatchesQuery.isFetching}
        canManage={canManage}
        onSearchChange={(value) => {
          setSearchInput(value)
          setCurrentPage(1)
        }}
        onStatusChange={(value) => {
          setStatus(value)
          setCurrentPage(1)
        }}
        onFishTypeChange={(value) => {
          setFishType(value)
          setCurrentPage(1)
        }}
        onRefresh={() => void fishBatchesQuery.refetch()}
        onAdd={handleOpenCreate}
      />

      <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/30">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredBatches.length}</span>{' '}
            batch ikan
          </p>
          <p className="text-slate-500">
            Filter aktif:{' '}
            <span className="font-semibold text-cyan-700">
              {[debouncedSearch || null, status !== 'All' ? status : null, fishType !== 'All' ? fishType : null]
                .map((item) => {
                  if (item === 'Stocking' || item === 'Growing' || item === 'Ready To Harvest' || item === 'Harvested') {
                    return getFishBatchStatusLabel(item)
                  }

                  return item
                })
                .filter(Boolean)
                .join(' • ') || 'semua data'}
            </span>
          </p>
        </div>
      </section>

      {fishBatchesQuery.isLoading ? <LoadingSkeleton /> : null}

      {!fishBatchesQuery.isLoading && fishBatchesQuery.isError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat data batch ikan</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {getErrorMessage(fishBatchesQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => void fishBatchesQuery.refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${fishBatchesQuery.isFetching ? 'animate-spin' : ''}`} />
            Coba Lagi
          </button>
        </section>
      ) : null}

      {!fishBatchesQuery.isLoading && !fishBatchesQuery.isError && filteredBatches.length === 0 ? (
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Fish className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Batch Ikan Tidak Ditemukan</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada batch ikan yang cocok dengan pencarian atau filter saat ini.
          </p>
        </section>
      ) : null}

      {!fishBatchesQuery.isLoading && !fishBatchesQuery.isError && filteredBatches.length > 0 ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30 sm:p-5">
          <FishBatchTable
            batches={paginatedBatches}
            canManage={canManage}
            onView={(batch) => setDetailBatchId(batch.id)}
            onEdit={handleOpenEdit}
            onDelete={handleDeletePrompt}
          />

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
          />
        </section>
      ) : null}

      <FishBatchFormModal
        isOpen={isFormOpen}
        mode={formMode}
        batch={selectedBatch}
        ponds={pondsQuery.data?.items ?? []}
        isSubmitting={createFishBatchMutation.isPending || updateFishBatchMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedBatch(null)
        }}
        onSubmit={handleSubmitFishBatch}
      />

      <FishBatchDetailModal
        isOpen={detailBatchId !== null}
        batchId={detailBatchId}
        onClose={() => setDetailBatchId(null)}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        description={`Batch "${deleteTarget?.batch_code ?? ''}" akan dihapus permanen dari sistem.`}
        isDeleting={deleteFishBatchMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

export default FishBatchesManagementPage
