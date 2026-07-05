import { useMemo, useState } from 'react'
import { AlertCircle, Activity, Blocks, RefreshCcw, ShieldCheck, Users } from 'lucide-react'
import { Pagination } from '@/components/admin/products/Pagination'
import {
  ActivityDetailModal,
  ActivityLogTable,
  ActivityTimeline,
  LoadingSkeleton,
  SearchFilter,
  SummaryCard,
} from '@/components/admin/activity-logs'
import { useActivityLogs, useAuth, useDebouncedValue, usePageTitle } from '@/hooks'
import type {
  ActivityLog,
  ActivityModuleFilter,
  ActivityRoleFilter,
  ActivityViewMode,
} from '@/types/activity-log'
import { formatNumber } from '@/utils/format'
import {
  getModuleDefinition,
  matchesActivityDate,
  isTodayActivity,
} from '@/pages/admin/activity-logs/activity-log.utils'

const PAGE_SIZE = 10
const FETCH_LIMIT = 1000

function getSearchableText(log: ActivityLog) {
  return `${log.user_name} ${log.action} ${log.description}`.toLowerCase()
}

export default function ActivityLogsManagementPage() {
  usePageTitle('Log Aktivitas')

  const { role } = useAuth()
  const [searchInput, setSearchInput] = useState('')
  const [moduleFilter, setModuleFilter] = useState<ActivityModuleFilter | 'all'>('all')
  const [roleFilter, setRoleFilter] = useState<ActivityRoleFilter | 'all'>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [viewMode, setViewMode] = useState<ActivityViewMode>('table')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const debouncedSearch = useDebouncedValue(searchInput.trim().toLowerCase(), 300)

  const activityLogsQuery = useActivityLogs({ page: 1, limit: FETCH_LIMIT })
  const logs = useMemo(() => activityLogsQuery.data?.items ?? [], [activityLogsQuery.data?.items])

  const isRoleFilterAvailable = useMemo(
    () => logs.some((log) => Boolean(log.user_role.trim())),
    [logs],
  )

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        debouncedSearch.length === 0 || getSearchableText(log).includes(debouncedSearch)
      const matchesModule =
        moduleFilter === 'all' || getModuleDefinition(log.module).key === moduleFilter
      const matchesRole =
        roleFilter === 'all' ||
        !isRoleFilterAvailable ||
        log.user_role.trim().toLowerCase() === roleFilter
      const matchesDate = matchesActivityDate(log, dateFilter)

      return matchesSearch && matchesModule && matchesRole && matchesDate
    })
  }, [dateFilter, debouncedSearch, isRoleFilterAvailable, logs, moduleFilter, roleFilter])

  const summary = useMemo(() => {
    const uniqueUsersToday = new Set<string>()
    const modules = new Map<string, number>()

    for (const log of filteredLogs) {
      const moduleLabel = getModuleDefinition(log.module).label
      modules.set(moduleLabel, (modules.get(moduleLabel) ?? 0) + 1)

      if (isTodayActivity(log.created_at) && log.user_name.trim()) {
        uniqueUsersToday.add(log.user_name.trim().toLowerCase())
      }
    }

    const mostActiveModule =
      [...modules.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] || '-'

    return {
      totalActivities: filteredLogs.length,
      todayActivities: filteredLogs.filter((log) => isTodayActivity(log.created_at)).length,
      activeUsersToday: uniqueUsersToday.size,
      mostActiveModule,
    }
  }, [filteredLogs])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const currentLogs = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
    return filteredLogs.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filteredLogs, safeCurrentPage])

  if (role !== 'admin') {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="admin-page-hero rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Activity Logs
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              Audit trail operasional yang rapi dan mudah ditelusuri
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Pantau seluruh aktivitas penting admin dari backend dalam tampilan tabel dan timeline
              yang responsif, bersih, dan siap dipakai pada lingkungan produksi.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Mode admin aktif. Data halaman ini memakai Bearer Token dan endpoint audit trail asli.
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Activities"
          value={formatNumber(summary.totalActivities)}
          description="Jumlah aktivitas yang cocok dengan filter audit trail saat ini."
          icon={Activity}
          tone="cyan"
        />
        <SummaryCard
          title="Today Activities"
          value={formatNumber(summary.todayActivities)}
          description="Aktivitas yang tercatat pada hari ini dari data backend yang dimuat."
          icon={ShieldCheck}
          tone="emerald"
        />
        <SummaryCard
          title="Active Users Today"
          value={formatNumber(summary.activeUsersToday)}
          description="Jumlah user unik yang tercatat aktif hari ini pada log aktivitas."
          icon={Users}
          tone="amber"
        />
        <SummaryCard
          title="Most Active Module"
          value={summary.mostActiveModule}
          description="Modul dengan jumlah aktivitas terbanyak pada hasil filter aktif."
          icon={Blocks}
          tone="slate"
        />
      </section>

      <SearchFilter
        search={searchInput}
        moduleFilter={moduleFilter}
        roleFilter={roleFilter}
        dateFilter={dateFilter}
        viewMode={viewMode}
        isRefreshing={activityLogsQuery.isFetching}
        isRoleFilterAvailable={isRoleFilterAvailable}
        onSearchChange={(value) => {
          setSearchInput(value)
          setCurrentPage(1)
        }}
        onModuleFilterChange={(value) => {
          setModuleFilter(value)
          setCurrentPage(1)
        }}
        onRoleFilterChange={(value) => {
          setRoleFilter(value)
          setCurrentPage(1)
        }}
        onDateFilterChange={(value) => {
          setDateFilter(value)
          setCurrentPage(1)
        }}
        onViewModeChange={(value) => {
          setViewMode(value)
          setCurrentPage(1)
        }}
        onRefresh={() => void activityLogsQuery.refetch()}
      />

      <section className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg shadow-slate-200/30">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">{filteredLogs.length}</span>{' '}
            aktivitas
          </p>
          <p className="text-slate-500">
            Tampilan aktif:{' '}
            <span className="font-semibold text-cyan-700">
              {viewMode === 'table' ? 'Table View' : 'Timeline View'}
            </span>
          </p>
        </div>
      </section>

      {activityLogsQuery.isLoading ? <LoadingSkeleton /> : null}

      {!activityLogsQuery.isLoading && activityLogsQuery.isError ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-xl border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-red-100/40">
          <div className="rounded-full bg-red-50 p-4 text-red-600">
            <AlertCircle className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Gagal memuat activity logs</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Terjadi kendala saat mengambil data audit trail dari backend. Silakan coba lagi.
          </p>
          <button
            type="button"
            onClick={() => void activityLogsQuery.refetch()}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            <RefreshCcw className={`size-4 ${activityLogsQuery.isFetching ? 'animate-spin' : ''}`} />
            Retry
          </button>
        </section>
      ) : null}

      {!activityLogsQuery.isLoading && !activityLogsQuery.isError && filteredLogs.length === 0 ? (
        <section className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/40">
          <div className="rounded-full bg-slate-100 p-4 text-slate-400">
            <Activity className="size-7" />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">No Activity Found</h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
            Belum ada aktivitas yang cocok dengan pencarian dan filter yang sedang dipakai.
          </p>
        </section>
      ) : null}

      {!activityLogsQuery.isLoading && !activityLogsQuery.isError && filteredLogs.length > 0 ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/30 sm:p-5">
          {viewMode === 'table' ? (
            <ActivityLogTable logs={currentLogs} onView={setSelectedLog} />
          ) : (
            <ActivityTimeline logs={currentLogs} onView={setSelectedLog} />
          )}

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(Math.min(page, totalPages))}
          />
        </section>
      ) : null}

      <ActivityDetailModal
        logId={selectedLog?.id ?? null}
        fallbackLog={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  )
}
