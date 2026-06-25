import {
  AlertTriangle,
  ClipboardList,
  Fish,
  PackageCheck,
  PackageOpen,
  RefreshCcw,
  Waves,
} from 'lucide-react'
import { FeedUsageChart } from '@/components/staff/dashboard/FeedUsageChart'
import { FishBatchStatusChart } from '@/components/staff/dashboard/FishBatchStatusChart'
import { HarvestScheduleChart } from '@/components/staff/dashboard/HarvestScheduleChart'
import { InventoryAlertTable } from '@/components/staff/dashboard/InventoryAlertTable'
import { KpiCard } from '@/components/staff/dashboard/KpiCard'
import { LoadingSkeleton } from '@/components/staff/dashboard/LoadingSkeleton'
import { QuickActions } from '@/components/staff/dashboard/QuickActions'
import { RecentActivityTimeline } from '@/components/staff/dashboard/RecentActivityTimeline'
import { TaskCard } from '@/components/staff/dashboard/TaskCard'
import { UpcomingHarvestTable } from '@/components/staff/dashboard/UpcomingHarvestTable'
import { WelcomeCard } from '@/components/staff/dashboard/WelcomeCard'
import { useAuth, usePageTitle } from '@/hooks'
import { useStaffDashboard } from '@/hooks/useStaffDashboard'
import type { StaffDashboard, StaffTask } from '@/types/staff-dashboard'

function toPercent(value: number, total: number) {
  if (total <= 0) {
    return '0%'
  }

  return `${Math.round((value / total) * 100)}%`
}

function buildFallbackTasks(data: StaffDashboard): StaffTask[] {
  return [
    {
      id: 'feeding',
      title: 'Input Feeding',
      description: 'Pastikan seluruh log pemberian pakan hari ini sudah dicatat.',
      status: data.today_feedings > 0 ? 'Completed' : 'Pending',
      deadline: 'Hari ini',
      priority: data.today_feedings > 0 ? 'Medium' : 'High',
    },
    {
      id: 'pond-check',
      title: 'Check Pond Condition',
      description: 'Verifikasi kondisi kolam aktif dan cek indikator budidaya utama.',
      status: data.active_ponds > 0 ? 'In Progress' : 'Pending',
      deadline: 'Hari ini',
      priority: 'Medium',
    },
    {
      id: 'harvest',
      title: 'Record Harvest',
      description: 'Catat panen batch yang sudah siap atau dijadwalkan hari ini.',
      status:
        data.today_harvests > 0
          ? 'Completed'
          : data.ready_to_harvest > 0
            ? 'Attention'
            : 'Pending',
      deadline: 'Hari ini',
      priority: data.ready_to_harvest > 0 ? 'Critical' : 'Medium',
    },
    {
      id: 'inventory',
      title: 'Update Inventory',
      description: 'Sinkronkan stok pakan dan tindak lanjuti item di bawah minimum.',
      status: data.low_stock_feeds > 0 ? 'Attention' : 'Completed',
      deadline: 'Hari ini',
      priority: data.low_stock_feeds > 0 ? 'High' : 'Low',
    },
  ]
}

function StaffDashboardPage() {
  usePageTitle('Staff Dashboard')

  const { user, role } = useAuth()
  const dashboardQuery = useStaffDashboard()

  if (role !== 'staff' && role !== 'admin') {
    return null
  }

  if (dashboardQuery.isLoading) {
    return <LoadingSkeleton />
  }

  if (dashboardQuery.isError) {
    return (
      <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[1.75rem] border border-rose-200 bg-white px-6 py-12 text-center shadow-lg shadow-rose-100/70">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">
          Gagal memuat staff dashboard
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Endpoint dashboard staff belum merespons sesuai yang dibutuhkan atau sedang ada kendala
          saat mengambil data operasional terbaru.
        </p>
        <button
          type="button"
          onClick={() => void dashboardQuery.refetch()}
          className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-600"
        >
          Retry
        </button>
      </section>
    )
  }

  const dashboard = dashboardQuery.data

  if (!dashboard || !user) {
    return null
  }

  const tasks =
    dashboard.today_tasks.length > 0 ? dashboard.today_tasks : buildFallbackTasks(dashboard)

  return (
    <div className="space-y-6">
      <WelcomeCard name={user.name} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Ponds"
          value={dashboard.total_ponds}
          description="Jumlah seluruh kolam budidaya."
          icon={Waves}
          tone="blue"
          trendLabel={`${toPercent(dashboard.active_ponds, dashboard.total_ponds)} aktif`}
          trendDirection="up"
        />
        <KpiCard
          title="Active Ponds"
          value={dashboard.active_ponds}
          description="Kolam yang sedang dipakai untuk operasional."
          icon={PackageOpen}
          tone="blue"
          trendLabel={`${Math.max(dashboard.total_ponds - dashboard.active_ponds, 0)} idle`}
          trendDirection="neutral"
        />
        <KpiCard
          title="Growing Batches"
          value={dashboard.growing_batches}
          description="Batch ikan yang masih dalam fase pertumbuhan."
          icon={Fish}
          tone="purple"
          trendLabel={`${toPercent(dashboard.growing_batches, dashboard.total_batches)} dari total batch`}
          trendDirection="up"
        />
        <KpiCard
          title="Ready To Harvest"
          value={dashboard.ready_to_harvest}
          description="Batch siap dipanen atau perlu perhatian."
          icon={PackageCheck}
          tone="green"
          trendLabel="Prioritas panen"
          trendDirection={dashboard.ready_to_harvest > 0 ? 'up' : 'neutral'}
        />
        <KpiCard
          title="Today's Feedings"
          value={dashboard.today_feedings}
          description="Jumlah log pemberian pakan yang masuk hari ini."
          icon={ClipboardList}
          tone="orange"
          trendLabel="Aktivitas hari ini"
          trendDirection={dashboard.today_feedings > 0 ? 'up' : 'neutral'}
        />
        <KpiCard
          title="Today's Harvests"
          value={dashboard.today_harvests}
          description="Total aktivitas panen yang tercatat hari ini."
          icon={PackageCheck}
          tone="green"
          trendLabel="Rekap panen harian"
          trendDirection={dashboard.today_harvests > 0 ? 'up' : 'neutral'}
        />
        <KpiCard
          title="Low Feed Stocks"
          value={dashboard.low_stock_feeds}
          description="Item pakan yang perlu segera direstock."
          icon={AlertTriangle}
          tone="red"
          trendLabel={dashboard.low_stock_feeds > 0 ? 'Perlu tindakan' : 'Stok aman'}
          trendDirection={dashboard.low_stock_feeds > 0 ? 'down' : 'neutral'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <HarvestScheduleChart data={dashboard.harvest_schedule} />
        <FeedUsageChart data={dashboard.feed_usage_trend} />
        <FishBatchStatusChart data={dashboard.fish_batch_status} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_rgba(148,163,184,0.14)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600">
              Today's Tasks
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Fokus kerja staff hari ini</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        <QuickActions />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <UpcomingHarvestTable items={dashboard.upcoming_harvests} />
        <InventoryAlertTable items={dashboard.inventory_alerts} />
      </section>

      <RecentActivityTimeline items={dashboard.recent_activities} />
    </div>
  )
}

export default StaffDashboardPage
