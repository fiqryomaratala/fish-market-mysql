import { useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { AlertCircle, RefreshCcw, Users } from 'lucide-react'
import { toast } from 'sonner'
import {
  DeleteModal,
  LoadingSkeleton,
  Pagination,
  RoleModal,
  SearchFilter,
  StatusModal,
  SummaryCard,
  UserDetailModal,
  UserFormModal,
  UserTable,
} from '@/components/admin/users'
import {
  useCreateUser,
  useDebouncedValue,
  useDeleteUser,
  useUpdateUser,
  useUpdateUserRole,
  useUpdateUserStatus,
  useUsers,
} from '@/hooks'
import type { User, UserCreateInput, UserUpdateInput } from '@/types/user'

const PAGE_SIZE = 10

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.errors?.error ||
      error.message ||
      'Terjadi kesalahan saat memproses permintaan user.'
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Terjadi kesalahan saat memproses permintaan user.'
}

function UsersManagementPage() {
  const [searchInput, setSearchInput] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [detailUserId, setDetailUserId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [roleChangeTarget, setRoleChangeTarget] = useState<User | null>(null)
  const [statusChangeTarget, setStatusChangeTarget] = useState<User | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 350)

  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useUsers({
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    role: roleFilter === 'All' ? undefined : roleFilter,
    status: statusFilter === 'All' ? undefined : statusFilter,
  })

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()
  const updateRoleMutation = useUpdateUserRole()
  const updateStatusMutation = useUpdateUserStatus()

  const users = useMemo(() => data?.items ?? [], [data?.items])
  const totalUsers = data?.meta.total ?? 0
  const serverPage = data?.meta.page ?? currentPage
  const serverLimit = data?.meta.limit ?? PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(totalUsers / Math.max(serverLimit, 1)))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const summary = useMemo(() => {
    return {
      total: totalUsers,
      admin: users.filter((u) => u.role === 'Admin').length,
      staff: users.filter((u) => u.role === 'Staff').length,
      customer: users.filter((u) => u.role === 'Customer').length,
      active: users.filter((u) => u.status === 'Active').length,
    }
  }, [totalUsers, users])

  const openCreateModal = () => {
    setFormMode('create')
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const openEditModal = (user: User) => {
    setFormMode('edit')
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  const handleSubmitUser = async (payload: UserCreateInput | UserUpdateInput) => {
    try {
      if (formMode === 'create') {
        await createUserMutation.mutateAsync(payload as UserCreateInput)
        toast.success('User berhasil ditambahkan.')
      } else if (selectedUser) {
        await updateUserMutation.mutateAsync({ id: selectedUser.id, payload: payload as UserUpdateInput })
        toast.success('User berhasil diperbarui.')
      }

      setIsFormOpen(false)
      setSelectedUser(null)
    } catch (submitError) {
      toast.error(getErrorMessage(submitError))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteUserMutation.mutateAsync(deleteTarget.id)
      toast.success('User berhasil dihapus.')
      setDeleteTarget(null)
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError))
    }
  }

  const handleRoleChange = async (data: { role: string }) => {
    if (!roleChangeTarget) {
      return
    }

    try {
      await updateRoleMutation.mutateAsync({ id: roleChangeTarget.id, payload: data })
      toast.success('Role user berhasil diubah.')
      setRoleChangeTarget(null)
    } catch (roleError) {
      toast.error(getErrorMessage(roleError))
    }
  }

  const handleStatusChange = async (data: { status: string }) => {
    if (!statusChangeTarget) {
      return
    }

    try {
      await updateStatusMutation.mutateAsync({ id: statusChangeTarget.id, payload: data })
      toast.success('Status user berhasil diubah.')
      setStatusChangeTarget(null)
    } catch (statusError) {
      toast.error(getErrorMessage(statusError))
    }
  }

  return (
    <div className="space-y-6">
      <section className="admin-page-hero rounded-[2rem] border border-cyan-100 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_22%),linear-gradient(135deg,_#f8fdff_0%,_#ffffff_45%,_#f0fdfa_100%)] p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.34em] text-cyan-700">
              Manajemen User
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Kelola User Fish Marketplace
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau user, role, status, dan aktivitas dengan alur CRUD yang siap dipakai
              di lingkungan produksi.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <SummaryCard label="Total User" value={summary.total} isLoading={isLoading} />
            <SummaryCard label="Admin Halaman" value={summary.admin} isLoading={isLoading} />
            <SummaryCard label="Staff Halaman" value={summary.staff} isLoading={isLoading} />
            <SummaryCard label="Customer Halaman" value={summary.customer} isLoading={isLoading} />
            <SummaryCard label="Aktif Halaman" value={summary.active} isLoading={isLoading} />
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            Kontrol User Admin
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Atur pencarian dan aksi user</h2>
        </div>

        <div className="mt-5">
          <SearchFilter
            searchValue={searchInput}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            isRefreshing={isFetching}
            onSearchChange={(value) => {
              setSearchInput(value)
              setCurrentPage(1)
            }}
            onRoleChange={(value) => {
              setRoleFilter(value)
              setCurrentPage(1)
            }}
            onStatusChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
            onRefresh={() => void refetch()}
            onAdd={openCreateModal}
          />
        </div>

        <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600">
            <p>
              Menampilkan{' '}
              <span className="font-semibold text-slate-900">{users.length}</span>{' '}
              dari{' '}
              <span className="font-semibold text-slate-900">{totalUsers}</span>{' '}
              user
            </p>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <p>
              Pencarian realtime:{' '}
              <span className="font-semibold text-cyan-700">
                {debouncedSearch || 'semua user'}
              </span>
            </p>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" />
            <p>
              Halaman{' '}
              <span className="font-semibold text-slate-900">{Math.min(serverPage, totalPages)}</span>{' '}
              dari{' '}
              <span className="font-semibold text-slate-900">{totalPages}</span>
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
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat user</h2>
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

      {!isLoading && !error && users.length === 0 ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Users className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">User Tidak Ditemukan</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada user yang cocok dengan filter saat ini. Coba ubah pencarian, filter,
            atau tambahkan user baru.
          </p>
        </section>
      ) : null}

      {!isLoading && !error && users.length > 0 ? (
        <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-5">
          <UserTable
            users={users}
            onView={(user) => setDetailUserId(user.id)}
            onEdit={openEditModal}
            onChangeRole={setRoleChangeTarget}
            onChangeStatus={setStatusChangeTarget}
            onDelete={setDeleteTarget}
          />

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
          />
        </section>
      ) : null}

      <UserFormModal
        isOpen={isFormOpen}
        mode={formMode}
        user={selectedUser}
        isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
        onClose={() => {
          setIsFormOpen(false)
          setSelectedUser(null)
        }}
        onSubmit={handleSubmitUser}
      />

      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        userName={deleteTarget?.name ?? ''}
        isDeleting={deleteUserMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />

      <RoleModal
        isOpen={Boolean(roleChangeTarget)}
        userName={roleChangeTarget?.name ?? ''}
        currentRole={roleChangeTarget?.role ?? 'Customer'}
        isSubmitting={updateRoleMutation.isPending}
        onClose={() => setRoleChangeTarget(null)}
        onSubmit={handleRoleChange}
      />

      <StatusModal
        isOpen={Boolean(statusChangeTarget)}
        userName={statusChangeTarget?.name ?? ''}
        currentStatus={statusChangeTarget?.status ?? 'Active'}
        isSubmitting={updateStatusMutation.isPending}
        onClose={() => setStatusChangeTarget(null)}
        onSubmit={handleStatusChange}
      />

      <UserDetailModal
        isOpen={detailUserId !== null}
        userId={detailUserId}
        onClose={() => setDetailUserId(null)}
      />
    </div>
  )
}

export default UsersManagementPage
