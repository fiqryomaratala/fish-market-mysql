import { useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import {
  AlertCircle,
  Fish,
  PackageCheck,
  RefreshCcw,
  Scale,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DeleteModal,
  HarvestDetailModal,
  HarvestFormModal,
  HarvestPerformanceCard,
  HarvestTable,
  LoadingSkeleton,
  SearchFilter,
  SummaryCard,
  TransferModal,
} from '@/components/admin/harvests'
import { Pagination } from '@/components/admin/products'
import {
  useAuth,
  useCreateHarvest,
  useDebouncedValue,
  useDeleteHarvest,
  useFishBatches,
  useHarvests,
  useTransferHarvest,
  useUpdateHarvest,
} from '@/hooks'
import type { FishBatch } from '@/types/fish-batch'
import type { Harvest, HarvestMutationInput, HarvestStatus } from '@/types/harvest'
import { formatNumber } from '@/utils/format'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses panen.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses panen.'
}

function isSameDate(dateValue: string, filterValue: string) {
  if (!dateValue || !filterValue) {
    return true
  }

  return dateValue.slice(0, 10) === filterValue
}

function isThisMonth(dateValue: string) {
  if (!dateValue) {
    return false
  }

  const date = new Date(dateValue)
  const today = new Date()

  return (
    !Number.isNaN(date.getTime()) &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

function enrichHarvest(harvest: Harvest, fishBatchMap: Map<number, FishBatch>) {
  const batch = fishBatchMap.get(harvest.fish_batch_id)
  const survivalRate =
    harvest.survival_rate > 0
      ? harvest.survival_rate
      : batch && batch.initial_quantity > 0
        ? Math.max(0, Math.min(100, (harvest.total_quantity / batch.initial_quantity) * 100))
        : 0

  return {
    ...harvest,
    batch_code: harvest.batch_code !== '-' ? harvest.batch_code : batch?.batch_code ?? '-',
    fish_type: harvest.fish_type !== '-' ? harvest.fish_type : batch?.fish_type ?? '-',
    pond_name: harvest.pond_name !== '-' ? harvest.pond_name : batch?.pond_name ?? '-',
    survival_rate: survivalRate,
  }
}

function HarvestManagementPage() {
  const { role } = useAuth()
  const canManage = role === 'admin' || role === 'staff'
  const canDelete = role === 'admin'
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState<HarvestStatus | 'All'>('All')
  const [fishType, setFishType] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedHarvest, setSelectedHarvest] = useState<Harvest | null>(null)
  const [detailHarvestId, setDetailHarvestId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Harvest | null>(null)
  const [transferTarget, setTransferTarget] = useState<Harvest | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const harvestsQuery = useHarvests({ page: 1, limit: 1000 })
  const fishBatchesQuery = useFishBatches({ page: 1, limit: 1000 })
  const createHarvestMutation = useCreateHarvest()
  const updateHarvestMutation = useUpdateHarvest()
  const deleteHarvestMutation = useDeleteHarvest()
  const transferHarvestMutation = useTransferHarvest()

  const fishBatchMap = useMemo(
    () => new Map((fishBatchesQuery.data?.items ?? []).map((item) => [item.id, item])),
    [fishBatchesQuery.data?.items],
  )

  const enrichedHarvests = useMemo(
    () => (harvestsQuery.data?.items ?? []).map((item) => enrichHarvest(item, fishBatchMap)),
    [fishBatchMap, harvestsQuery.data?.items],
  )

  const filteredHarvests = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase()

    return enrichedHarvests.filter((harvest) => {
      const matchesSearch =
        keyword.length === 0 ||
        harvest.harvest_code.toLowerCase().includes(keyword) ||
        harvest.batch_code.toLowerCase().includes(keyword) ||
        harvest.fish_type.toLowerCase().includes(keyword)
      const matchesStatus = status === 'All' || harvest.status === status
      const matchesFishType = fishType === 'All' || harvest.fish_type === fishType
      const matchesDate = isSameDate(harvest.harvest_date, dateFilter)

      return matchesSearch && matchesStatus && matchesFishType && matchesDate
    })
  }, [dateFilter, debouncedSearch, enrichedHarvests, fishType, status])

  const totalPages = Math.max(1, Math.ceil(filteredHarvests.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedHarvests = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredHarvests.slice(start, start + PAGE_SIZE)
  }, [filteredHarvests, safeCurrentPage])

  const summary = useMemo(() => {
    const items = enrichedHarvests
    const totalWeight = items.reduce((sum, item) => sum + item.total_weight, 0)
    const averageSurvivalRate =
      items.length > 0
        ? items.reduce((sum, item) => sum + item.survival_rate, 0) / items.length
        : 0

    return {
      totalHarvest: items.length,
      thisMonthHarvest: items.filter((item) => isThisMonth(item.harvest_date)).length,
      totalHarvestWeight: totalWeight,
      averageSurvivalRate,
    }
  }, [enrichedHarvests])

  const fishTypes = useMemo(
    () => [...new Set(enrichedHarvests.map((item) => item.fish_type).filter((item) => item && item !== '-'))],
    [enrichedHarvests],
  )

  const performanceHarvest = filteredHarvests[0] ?? enrichedHarvests[0] ?? null

  const handleOpenCreate = () => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk menambah panen.')
      return
    }

    setFormMode('create')
    setSelectedHarvest(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (harvest: Harvest) => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk mengubah panen.')
      return
    }

    setFormMode('edit')
    setSelectedHarvest(harvest)
    setIsFormOpen(true)
  }

  const handleSubmitHarvest = async (payload: HarvestMutationInput) => {
    try {
      if (formMode === 'create') {
        await createHarvestMutation.mutateAsync(payload)
        toast.success('Data panen berhasil ditambahkan.')
      } else if (selectedHarvest) {
        await updateHarvestMutation.mutateAsync({ id: selectedHarvest.id, payload })
        toast.success('Data panen berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedHarvest(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDeleteHarvest = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteHarvestMutation.mutateAsync(deleteTarget.id)
      toast.success('Data panen berhasil dihapus.')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleTransferHarvest = async () => {
    if (!transferTarget) {
      return
    }

    try {
      await transferHarvestMutation.mutateAsync(transferTarget.id)
      toast.success('Panen berhasil ditransfer ke inventory.')
      setTransferTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const isLoading = harvestsQuery.isLoading || fishBatchesQuery.isLoading
  const hasError = harvestsQuery.isError || fishBatchesQuery.isError
  const isRefreshing = harvestsQuery.isFetching || fishBatchesQuery.isFetching

  if (role !== 'admin' && role !== 'staff') {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="admin-page-hero rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">Harvest Management</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Kelola data panen budidaya ikan</h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau realisasi panen, survival rate, dan hasil bobot panen dalam tampilan ERP dashboard yang
              rapi, responsif, dan siap dipakai di produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {canDelete
              ? 'Mode admin aktif. Anda bisa menambah, mengubah, transfer, dan menghapus data panen.'
              : 'Mode staff aktif. Anda bisa menambah, mengubah, dan memantau data panen.'}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Panen"
          value={formatNumber(summary.totalHarvest)}
          description="Jumlah data panen yang tersedia dari backend."
          icon={PackageCheck}
          tone="cyan"
        />
        <SummaryCard
          title="Panen Bulan Ini"
          value={formatNumber(summary.thisMonthHarvest)}
          description="Total panen dengan tanggal pada bulan berjalan."
          icon={Fish}
          tone="emerald"
        />
        <SummaryCard
          title="Total Bobot Panen"
          value={`${formatNumber(summary.totalHarvestWeight)} kg`}
          description="Akumulasi bobot panen dari seluruh data yang termuat."
          icon={Scale}
          tone="amber"
        />
        <SummaryCard
          title="Rata-rata Survival Rate"
          value={`${summary.averageSurvivalRate.toFixed(1)}%`}
          description="Rata-rata survival rate yang dihitung dari data batch dan quantity panen."
          icon={TrendingUp}
          tone="purple"
        />
      </section>

      <SearchFilter
        search={searchInput}
        status={status}
        fishType={fishType}
        dateFilter={dateFilter}
        fishTypes={fishTypes}
        isRefreshing={isRefreshing}
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
        onDateFilterChange={(value) => {
          setDateFilter(value)
          setCurrentPage(1)
        }}
        onRefresh={() => {
          void harvestsQuery.refetch()
          void fishBatchesQuery.refetch()
        }}
        onAdd={handleOpenCreate}
      />

      {performanceHarvest ? (
        <HarvestPerformanceCard
          totalWeight={performanceHarvest.total_weight}
          survivalRate={performanceHarvest.survival_rate}
        />
      ) : null}

      {isLoading ? <LoadingSkeleton /> : null}

      {!isLoading && hasError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat data panen</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {getErrorMessage(harvestsQuery.error || fishBatchesQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => {
              void harvestsQuery.refetch()
              void fishBatchesQuery.refetch()
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </section>
      ) : null}

      {!isLoading && !hasError && filteredHarvests.length === 0 ? (
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <PackageCheck className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">No Harvest Found</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada data panen yang cocok dengan pencarian dan filter saat ini.
          </p>
        </section>
      ) : null}

      {!isLoading && !hasError && filteredHarvests.length > 0 ? (
        <section className="space-y-4">
          <HarvestTable
            harvests={paginatedHarvests}
            canManage={canManage}
            canDelete={canDelete}
            onView={(harvest) => setDetailHarvestId(harvest.id)}
            onEdit={handleOpenEdit}
            onTransfer={(harvest) => {
              if (!canManage) {
                toast.error('Anda tidak memiliki akses untuk transfer panen.')
                return
              }

              setTransferTarget(harvest)
            }}
            onDelete={(harvest) => {
              if (!canDelete) {
                toast.error('Aksi hapus hanya tersedia untuk admin.')
                return
              }

              setDeleteTarget(harvest)
            }}
          />

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
          />
        </section>
      ) : null}

      <HarvestFormModal
        isOpen={isFormOpen}
        mode={formMode}
        harvest={selectedHarvest}
        fishBatches={fishBatchesQuery.data?.items ?? []}
        isSubmitting={createHarvestMutation.isPending || updateHarvestMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedHarvest(null)
        }}
        onSubmit={handleSubmitHarvest}
      />

      <HarvestDetailModal
        isOpen={detailHarvestId !== null}
        harvestId={detailHarvestId}
        onClose={() => setDetailHarvestId(null)}
      />

      <TransferModal
        isOpen={Boolean(transferTarget)}
        harvest={transferTarget}
        isSubmitting={transferHarvestMutation.isPending}
        onClose={() => setTransferTarget(null)}
        onConfirm={() => void handleTransferHarvest()}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        description={`Data panen "${deleteTarget?.harvest_code ?? ''}" akan dihapus permanen dari sistem.`}
        isDeleting={deleteHarvestMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteHarvest()}
      />
    </div>
  )
}

export default HarvestManagementPage
