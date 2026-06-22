import { useEffect, useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import {
  AlertCircle,
  ClipboardList,
  Fish,
  PackageCheck,
  RefreshCcw,
  Scale,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DeleteModal,
  FeedingLogDetailModal,
  FeedingLogFormModal,
  FeedingLogTable,
  FeedConsumptionCard,
  LoadingSkeleton,
  SearchFilter,
  SummaryCard,
} from '@/components/admin/feeding-logs'
import { Pagination } from '@/components/admin/products'
import {
  useAuth,
  useCreateFeedingLog,
  useDebouncedValue,
  useDeleteFeedingLog,
  useFeedingLogs,
  useFishBatches,
  useInventories,
  useUpdateFeedingLog,
} from '@/hooks'
import type { FeedingLog, FeedingLogMutationInput } from '@/types/feeding-log'
import { formatNumber } from '@/utils/format'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses log pakan.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses log pakan.'
}

function isSameDate(dateValue: string, filterValue: string) {
  if (!dateValue || !filterValue) {
    return true
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.toISOString().slice(0, 10) === filterValue
}

function getStartOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function getStartOfWeek() {
  const today = getStartOfToday()
  const day = today.getDay()
  const diff = day === 0 ? 6 : day - 1
  today.setDate(today.getDate() - diff)
  return today
}

function normalizeLog(
  log: FeedingLog,
  fishBatchMap: Map<number, { batch_code: string; fish_type: string; pond_name: string }>,
) {
  const batch = fishBatchMap.get(log.fish_batch_id)

  return {
    ...log,
    batch_code: log.batch_code !== '-' ? log.batch_code : batch?.batch_code || '-',
    fish_type: log.fish_type !== '-' ? log.fish_type : batch?.fish_type || '-',
    pond_name: log.pond_name || batch?.pond_name || '-',
    feed_name: log.feed_name || log.feed_type,
  }
}

function FeedingLogsManagementPage() {
  const { role } = useAuth()
  const canManage = role === 'admin' || role === 'staff'
  const canDelete = role === 'admin'
  const [searchInput, setSearchInput] = useState('')
  const [batchFilter, setBatchFilter] = useState('All')
  const [feedFilter, setFeedFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedLog, setSelectedLog] = useState<FeedingLog | null>(null)
  const [detailLog, setDetailLog] = useState<FeedingLog | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<FeedingLog | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const feedingLogsQuery = useFeedingLogs({ page: 1, limit: 1000 })
  const fishBatchesQuery = useFishBatches({ page: 1, limit: 1000 })
  const inventoriesQuery = useInventories({ page: 1, limit: 1000 })
  const createFeedingLogMutation = useCreateFeedingLog()
  const updateFeedingLogMutation = useUpdateFeedingLog()
  const deleteFeedingLogMutation = useDeleteFeedingLog()

  const feedInventories = useMemo(
    () =>
      (inventoriesQuery.data?.items ?? []).filter(
        (item) => item.category.toLowerCase() === 'feed',
      ),
    [inventoriesQuery.data?.items],
  )

  const fishBatchMap = useMemo(
    () =>
      new Map(
        (fishBatchesQuery.data?.items ?? []).map((item) => [
          item.id,
          {
            batch_code: item.batch_code,
            fish_type: item.fish_type,
            pond_name: item.pond_name,
          },
        ]),
      ),
    [fishBatchesQuery.data?.items],
  )

  const enrichedLogs = useMemo(
    () => (feedingLogsQuery.data?.items ?? []).map((log) => normalizeLog(log, fishBatchMap)),
    [feedingLogsQuery.data?.items, fishBatchMap],
  )

  const filteredLogs = useMemo(() => {
    return enrichedLogs.filter((log) => {
      const keyword = debouncedSearch.toLowerCase()
      const matchesSearch =
        keyword.length === 0 ||
        log.batch_code.toLowerCase().includes(keyword) ||
        log.fish_type.toLowerCase().includes(keyword) ||
        log.feed_name.toLowerCase().includes(keyword)
      const matchesBatch =
        batchFilter === 'All' || log.fish_batch_id === Number(batchFilter)
      const matchesFeed = feedFilter === 'All' || log.feed_name === feedFilter
      const matchesDate = isSameDate(log.feeding_time, dateFilter)

      return matchesSearch && matchesBatch && matchesFeed && matchesDate
    })
  }, [batchFilter, dateFilter, debouncedSearch, enrichedLogs, feedFilter])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const paginatedLogs = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredLogs, totalPages])

  const summary = useMemo(() => {
    const today = getStartOfToday()
    const weekStart = getStartOfWeek()
    const totalsByFeed = new Map<string, number>()
    let totalFeedUsed = 0
    let totalActiveDays = 0
    const uniqueDays = new Set<string>()

    for (const log of filteredLogs) {
      totalFeedUsed += log.quantity
      totalsByFeed.set(log.feed_name, (totalsByFeed.get(log.feed_name) ?? 0) + log.quantity)

      const date = new Date(log.feeding_time)
      if (!Number.isNaN(date.getTime())) {
        uniqueDays.add(date.toISOString().slice(0, 10))
      }
    }

    totalActiveDays = uniqueDays.size

    const mostUsedFeed =
      [...totalsByFeed.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

    return {
      totalLogs: filteredLogs.length,
      todayLogs: filteredLogs.filter((log) => {
        const date = new Date(log.feeding_time)
        return !Number.isNaN(date.getTime()) && date >= today
      }).length,
      thisWeekLogs: filteredLogs.filter((log) => {
        const date = new Date(log.feeding_time)
        return !Number.isNaN(date.getTime()) && date >= weekStart
      }).length,
      totalFeedUsed,
      averageFeedPerDay: totalActiveDays > 0 ? totalFeedUsed / totalActiveDays : 0,
      mostUsedFeed,
    }
  }, [filteredLogs])

  const batchOptions = useMemo(
    () =>
      (fishBatchesQuery.data?.items ?? []).map((item) => ({
        fish_batch_id: item.id,
        batch_code: item.batch_code,
      })),
    [fishBatchesQuery.data?.items],
  )

  const feedOptions = useMemo(
    () => [...new Set(feedInventories.map((item) => item.name))],
    [feedInventories],
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [batchFilter, dateFilter, debouncedSearch, feedFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const handleOpenCreate = () => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk menambah log pakan.')
      return
    }

    setFormMode('create')
    setSelectedLog(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (log: FeedingLog) => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk mengubah log pakan.')
      return
    }

    setFormMode('edit')
    setSelectedLog(log)
    setIsFormOpen(true)
  }

  const handleDeletePrompt = (log: FeedingLog) => {
    if (!canDelete) {
      toast.error('Aksi hapus log pakan hanya tersedia untuk admin.')
      return
    }

    setDeleteTarget(log)
  }

  const handleSubmitFeedingLog = async (payload: FeedingLogMutationInput) => {
    try {
      if (formMode === 'create') {
        await createFeedingLogMutation.mutateAsync(payload)
        toast.success('Log pakan berhasil ditambahkan.')
      } else if (selectedLog) {
        await updateFeedingLogMutation.mutateAsync({
          id: selectedLog.id,
          payload,
        })
        toast.success('Log pakan berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedLog(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteFeedingLogMutation.mutateAsync(deleteTarget.id)
      toast.success('Log pakan berhasil dihapus.')
      setDeleteTarget(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const isLoading =
    feedingLogsQuery.isLoading || fishBatchesQuery.isLoading || inventoriesQuery.isLoading
  const hasError =
    feedingLogsQuery.isError || fishBatchesQuery.isError || inventoriesQuery.isError
  const isRefreshing =
    feedingLogsQuery.isFetching || fishBatchesQuery.isFetching || inventoriesQuery.isFetching

  if (role !== 'admin' && role !== 'staff') {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Manajemen Log Pakan
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Kelola pencatatan pemberian pakan dengan rapi
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Monitoring batch, konsumsi pakan, waktu feeding, dan jejak operasional dalam satu
              dashboard admin yang responsif dan siap produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {role === 'admin'
              ? 'Mode admin aktif. Anda dapat melihat, menambah, mengubah, dan menghapus log pakan.'
              : 'Mode staff aktif. Anda dapat melihat, menambah, dan mengubah log pakan.'}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Log Pakan"
          value={formatNumber(summary.totalLogs)}
          description="Jumlah log pakan yang sesuai dengan filter aktif."
          icon={ClipboardList}
          tone="cyan"
        />
        <SummaryCard
          title="Pakan Hari Ini"
          value={formatNumber(summary.todayLogs)}
          description="Jumlah aktivitas pemberian pakan yang tercatat hari ini."
          icon={Fish}
          tone="emerald"
        />
        <SummaryCard
          title="Pakan Minggu Ini"
          value={formatNumber(summary.thisWeekLogs)}
          description="Aktivitas pemberian pakan selama minggu berjalan dari data yang dimuat."
          icon={PackageCheck}
          tone="amber"
        />
        <SummaryCard
          title="Total Pakan Digunakan"
          value={`${formatNumber(summary.totalFeedUsed)} kg`}
          description="Akumulasi pakan yang tercatat pada log pakan saat ini."
          icon={Scale}
          tone="slate"
        />
      </section>

      <FeedConsumptionCard
        totalFeedUsed={`${formatNumber(summary.totalFeedUsed)} kg`}
        averageFeedPerDay={`${formatNumber(Number(summary.averageFeedPerDay.toFixed(2)))} kg`}
        mostUsedFeed={summary.mostUsedFeed}
      />

      <SearchFilter
        search={searchInput}
        batchFilter={batchFilter}
        feedFilter={feedFilter}
        dateFilter={dateFilter}
        batchOptions={batchOptions}
        feedOptions={feedOptions}
        isRefreshing={isRefreshing}
        canManage={canManage}
        onSearchChange={setSearchInput}
        onBatchFilterChange={setBatchFilter}
        onFeedFilterChange={setFeedFilter}
        onDateFilterChange={setDateFilter}
        onRefresh={() => {
          void feedingLogsQuery.refetch()
          void fishBatchesQuery.refetch()
          void inventoriesQuery.refetch()
        }}
        onAdd={handleOpenCreate}
      />

      <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/30">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredLogs.length}</span>{' '}
            log pakan
          </p>
          <p className="text-slate-500">
            Filter aktif:{' '}
            <span className="font-semibold text-cyan-700">
              {debouncedSearch || batchFilter !== 'All' || feedFilter !== 'All' || dateFilter
                ? [
                    debouncedSearch || null,
                    batchFilter !== 'All'
                      ? batchOptions.find((item) => item.fish_batch_id === Number(batchFilter))?.batch_code || null
                      : null,
                    feedFilter !== 'All' ? feedFilter : null,
                    dateFilter || null,
                  ]
                    .filter(Boolean)
                    .join(' | ')
                : 'semua data'}
            </span>
          </p>
        </div>
      </section>

      {isLoading ? <LoadingSkeleton /> : null}

      {!isLoading && hasError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat data log pakan</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {getErrorMessage(feedingLogsQuery.error || fishBatchesQuery.error || inventoriesQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => {
              void feedingLogsQuery.refetch()
              void fishBatchesQuery.refetch()
              void inventoriesQuery.refetch()
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Coba Lagi
          </button>
        </section>
      ) : null}

      {!isLoading && !hasError && filteredLogs.length === 0 ? (
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <ClipboardList className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Log Pakan Tidak Ditemukan</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada log pakan yang cocok dengan pencarian dan filter saat ini.
          </p>
        </section>
      ) : null}

      {!isLoading && !hasError && filteredLogs.length > 0 ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30 sm:p-5">
          <FeedingLogTable
            logs={paginatedLogs}
            canManage={canManage}
            canDelete={canDelete}
            onView={setDetailLog}
            onEdit={handleOpenEdit}
            onDelete={handleDeletePrompt}
          />

          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      ) : null}

      <FeedingLogFormModal
        isOpen={isFormOpen}
        mode={formMode}
        log={selectedLog}
        fishBatches={fishBatchesQuery.data?.items ?? []}
        feedInventories={feedInventories}
        isSubmitting={createFeedingLogMutation.isPending || updateFeedingLogMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedLog(null)
        }}
        onSubmit={handleSubmitFeedingLog}
      />

      <FeedingLogDetailModal
        isOpen={detailLog !== null}
        logId={detailLog?.id ?? null}
        fallbackLog={detailLog}
        onClose={() => setDetailLog(null)}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        description={`Log pakan untuk batch "${deleteTarget?.batch_code ?? ''}" akan dihapus permanen dari sistem.`}
        isDeleting={deleteFeedingLogMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

export default FeedingLogsManagementPage
