import { useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { AlertCircle, Database, RefreshCcw, Settings, Waves } from 'lucide-react'
import { toast } from 'sonner'
import {
  DeleteModal,
  LoadingSkeleton,
  PondDetailModal,
  PondFormModal,
  PondTable,
  SearchFilter,
  SummaryCard,
} from '@/components/admin/ponds'
import {
  useAuth,
  useCreatePond,
  useDebouncedValue,
  useDeletePond,
  usePonds,
  useUpdatePond,
} from '@/hooks'
import { Pagination } from '@/components/admin/products'
import type { Pond, PondMutationInput, PondStatus } from '@/types/pond'
import { formatNumber } from '@/utils/format'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses data kolam.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses data kolam.'
}

function PondsManagementPage() {
  const { role } = useAuth()
  const canManage = role === 'admin' || role === 'staff'
  const [searchInput, setSearchInput] = useState('')
  const [status, setStatus] = useState<PondStatus | 'All'>('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedPond, setSelectedPond] = useState<Pond | null>(null)
  const [detailPondId, setDetailPondId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Pond | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300)

  const pondsQuery = usePonds({ page: 1, limit: 1000 })
  const createPondMutation = useCreatePond()
  const updatePondMutation = useUpdatePond()
  const deletePondMutation = useDeletePond()

  const filteredPonds = useMemo(() => {
    return (pondsQuery.data?.items ?? []).filter((pond) => {
      const keyword = debouncedSearch.toLowerCase()
      const matchesSearch =
        keyword.length === 0 ||
        pond.name.toLowerCase().includes(keyword) ||
        pond.code.toLowerCase().includes(keyword) ||
        pond.location.toLowerCase().includes(keyword)
      const matchesStatus = status === 'All' || pond.status === status

      return matchesSearch && matchesStatus
    })
  }, [debouncedSearch, pondsQuery.data?.items, status])

  const totalPages = Math.max(1, Math.ceil(filteredPonds.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedPonds = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE

    return filteredPonds.slice(start, start + PAGE_SIZE)
  }, [filteredPonds, safeCurrentPage])

  const summary = useMemo(() => {
    const items = pondsQuery.data?.items ?? []

    return {
      totalPonds: items.length,
      activePonds: items.filter((item) => item.status === 'Active').length,
      maintenancePonds: items.filter((item) => item.status === 'Maintenance').length,
      totalCapacity: items.reduce((total, item) => total + item.capacity, 0),
    }
  }, [pondsQuery.data?.items])

  const handleOpenCreate = () => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk menambah kolam.')
      return
    }

    setFormMode('create')
    setSelectedPond(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (pond: Pond) => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk mengubah kolam.')
      return
    }

    setFormMode('edit')
    setSelectedPond(pond)
    setIsFormOpen(true)
  }

  const handleDeletePrompt = (pond: Pond) => {
    if (!canManage) {
      toast.error('Anda tidak memiliki akses untuk menghapus kolam.')
      return
    }

    setDeleteTarget(pond)
  }

  const handleSubmitPond = async (payload: PondMutationInput) => {
    try {
      if (formMode === 'create') {
        await createPondMutation.mutateAsync(payload)
        toast.success('Kolam berhasil ditambahkan.')
      } else if (selectedPond) {
        await updatePondMutation.mutateAsync({ id: selectedPond.id, payload })
        toast.success('Kolam berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedPond(null)
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deletePondMutation.mutateAsync(deleteTarget.id)
      toast.success('Kolam berhasil dihapus.')
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
              Pond Management
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Kelola data kolam budidaya dengan rapi
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau lokasi kolam, dimensi, kapasitas, sumber air, dan status operasional dalam
              satu halaman yang responsif dan siap produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Mode akses {role === 'admin' ? 'admin' : 'staff'} aktif untuk monitoring dan pengelolaan data kolam.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Ponds"
          value={formatNumber(summary.totalPonds)}
          description="Jumlah seluruh kolam yang berhasil dimuat dari backend."
          icon={Waves}
          tone="cyan"
        />
        <SummaryCard
          title="Active Ponds"
          value={formatNumber(summary.activePonds)}
          description="Kolam dengan status aktif dan siap digunakan untuk operasional."
          icon={Database}
          tone="emerald"
        />
        <SummaryCard
          title="Maintenance Ponds"
          value={formatNumber(summary.maintenancePonds)}
          description="Kolam yang sedang dalam perawatan atau pemeriksaan teknis."
          icon={Settings}
          tone="amber"
        />
        <SummaryCard
          title="Total Capacity"
          value={formatNumber(summary.totalCapacity)}
          description="Akumulasi kapasitas seluruh kolam yang terdaftar di sistem."
          icon={Waves}
          tone="slate"
        />
      </section>

      <SearchFilter
        search={searchInput}
        status={status}
        isRefreshing={pondsQuery.isFetching}
        canManage={canManage}
        onSearchChange={(value) => {
          setSearchInput(value)
          setCurrentPage(1)
        }}
        onStatusChange={(value) => {
          setStatus(value)
          setCurrentPage(1)
        }}
        onRefresh={() => void pondsQuery.refetch()}
        onAdd={handleOpenCreate}
      />

      <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/30">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredPonds.length}</span>{' '}
            kolam
          </p>
          <p className="text-slate-500">
            Filter aktif:{' '}
            <span className="font-semibold text-cyan-700">
              {debouncedSearch || status !== 'All'
                ? [debouncedSearch || null, status !== 'All' ? status : null]
                    .filter(Boolean)
                    .join(' • ')
                : 'semua data'}
            </span>
          </p>
        </div>
      </section>

      {pondsQuery.isLoading ? <LoadingSkeleton /> : null}

      {!pondsQuery.isLoading && pondsQuery.isError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat data kolam</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            {getErrorMessage(pondsQuery.error)}
          </p>
          <button
            type="button"
            onClick={() => void pondsQuery.refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${pondsQuery.isFetching ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </section>
      ) : null}

      {!pondsQuery.isLoading && !pondsQuery.isError && filteredPonds.length === 0 ? (
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Waves className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">No Pond Found</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada kolam yang cocok dengan pencarian atau filter status saat ini.
          </p>
        </section>
      ) : null}

      {!pondsQuery.isLoading && !pondsQuery.isError && filteredPonds.length > 0 ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30 sm:p-5">
          <PondTable
            ponds={paginatedPonds}
            canManage={canManage}
            onView={(pond) => setDetailPondId(pond.id)}
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

      <PondFormModal
        isOpen={isFormOpen}
        mode={formMode}
        pond={selectedPond}
        isSubmitting={createPondMutation.isPending || updatePondMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedPond(null)
        }}
        onSubmit={handleSubmitPond}
      />

      <PondDetailModal
        isOpen={detailPondId !== null}
        pondId={detailPondId}
        onClose={() => setDetailPondId(null)}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        description={`Kolam "${deleteTarget?.name ?? ''}" akan dihapus permanen dari sistem.`}
        isDeleting={deletePondMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  )
}

export default PondsManagementPage
