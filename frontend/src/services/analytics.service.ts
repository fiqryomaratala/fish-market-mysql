import { dashboardService } from '@/services/dashboard.service'
import { fishBatchService } from '@/services/fish-batch.service'
import { harvestService } from '@/services/harvest.service'
import { inventoryService } from '@/services/inventory.service'
import { orderManagementService } from '@/services/order-management.service'
import { pondService } from '@/services/pond.service'
import { productService } from '@/services/product.service'
import { reportService } from '@/services/report.service'
import { userService } from '@/services/user.service'
import { calculateSurvivalRate, type FishBatch } from '@/types/fish-batch'
import type { Harvest } from '@/types/harvest'
import type { Inventory } from '@/types/inventory'
import type { OrderDetail, OrderListItem } from '@/types/order-management'
import type { Pond } from '@/types/pond'
import type {
  CustomerAnalyticsResponse,
  DateFilterRange,
  FeedingAnalyticsResponse,
  FishBatchAnalyticsResponse,
  FishTypeDistribution,
  HarvestAnalyticsResponse,
  InsightCardData,
  InventoryAnalyticsResponse,
  KpiCardData,
  OrderAnalyticsResponse,
  PondAnalyticsResponse,
  PondProductivityData,
  RevenueAnalyticsResponse,
  SurvivalRateAnalytics,
  TopSellingFish,
} from '@/types/analytics'

type ProductMapValue = {
  name: string
  category: string
  price: number
}

function toDateKey(value: string) {
  if (!value) {
    return ''
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}

function normalizeFilter(params?: DateFilterRange) {
  return {
    start_date: params?.start_date?.trim() || undefined,
    end_date: params?.end_date?.trim() || undefined,
  }
}

function createDateSeries(params?: DateFilterRange, fallbackDays = 30): string[] {
  const filter = normalizeFilter(params)
  const end = filter.end_date ? new Date(filter.end_date) : new Date()
  const start = filter.start_date
    ? new Date(filter.start_date)
    : new Date(end.getTime() - (fallbackDays - 1) * 24 * 60 * 60 * 1000)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
    const today = new Date()
    const fallbackStart = new Date(today.getTime() - (fallbackDays - 1) * 24 * 60 * 60 * 1000)
    return createDateSeries({
      start_date: fallbackStart.toISOString().slice(0, 10),
      end_date: today.toISOString().slice(0, 10),
    })
  }

  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  const dates: string[] = []
  const cursor = new Date(start)

  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setDate(cursor.getDate() + 1)
  }

  return dates
}

function matchesDateRange(value: string, params?: DateFilterRange) {
  const filter = normalizeFilter(params)

  if (!value) {
    return !filter.start_date && !filter.end_date
  }

  const current = new Date(value)
  if (Number.isNaN(current.getTime())) {
    return true
  }

  if (filter.start_date) {
    const start = new Date(filter.start_date)
    start.setHours(0, 0, 0, 0)
    if (current < start) {
      return false
    }
  }

  if (filter.end_date) {
    const end = new Date(filter.end_date)
    end.setHours(23, 59, 59, 999)
    if (current > end) {
      return false
    }
  }

  return true
}

function normalizeRatio(value: number) {
  if (!Number.isFinite(value)) {
    return 0
  }

  return value > 1 ? value / 100 : value
}

function groupByDate<T>(items: T[], getDate: (item: T) => string) {
  const grouped = new Map<string, T[]>()

  for (const item of items) {
    const dateKey = toDateKey(getDate(item))
    if (!dateKey) {
      continue
    }

    const current = grouped.get(dateKey) ?? []
    current.push(item)
    grouped.set(dateKey, current)
  }

  return grouped
}

async function fetchAllOrders(params?: DateFilterRange) {
  const filter = normalizeFilter(params)
  const firstPage = await orderManagementService.getOrders({
    page: 1,
    limit: 100,
    date_from: filter.start_date,
    date_to: filter.end_date,
  })
  const orders = [...firstPage.orders]
  const totalPages = firstPage.meta?.total_pages ?? 1

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await orderManagementService.getOrders({
      page,
      limit: 100,
      date_from: filter.start_date,
      date_to: filter.end_date,
    })
    orders.push(...response.orders)
  }

  return {
    orders,
    summary: firstPage.summary,
  }
}

async function fetchAllUsers() {
  const firstPage = await userService.getUsers({ page: 1, limit: 100 })
  const items = [...firstPage.items]
  const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.limit))

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await userService.getUsers({ page, limit: 100 })
    items.push(...response.items)
  }

  return items
}

async function fetchAllFishBatches() {
  const firstPage = await fishBatchService.getFishBatches({ page: 1, limit: 100 })
  const items = [...firstPage.items]
  const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.limit))

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await fishBatchService.getFishBatches({ page, limit: 100 })
    items.push(...response.items)
  }

  return items
}

async function fetchAllHarvests(params?: DateFilterRange) {
  const filter = normalizeFilter(params)
  const firstPage = await harvestService.getHarvests({
    page: 1,
    limit: 100,
    start_date: filter.start_date,
    end_date: filter.end_date,
  })
  const items = [...firstPage.items]
  const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.limit))

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await harvestService.getHarvests({
      page,
      limit: 100,
      start_date: filter.start_date,
      end_date: filter.end_date,
    })
    items.push(...response.items)
  }

  return items
}

async function fetchAllPonds() {
  const firstPage = await pondService.getPonds({ page: 1, limit: 100 })
  const items = [...firstPage.items]
  const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.limit))

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await pondService.getPonds({ page, limit: 100 })
    items.push(...response.items)
  }

  return items
}

async function getProductMap() {
  const products = await productService.getProducts({ page: 1, limit: 1000 }, { admin: true })
  return new Map<number, ProductMapValue>(
    products.items.map((product) => [
      product.id,
      {
        name: product.name,
        category: product.category,
        price: product.price,
      },
    ]),
  )
}

async function fetchOrderDetails(orders: OrderListItem[]) {
  const results = await Promise.allSettled(
    orders.map((order) => orderManagementService.getOrderById(order.id)),
  )

  return results
    .filter((result): result is PromiseFulfilledResult<OrderDetail> => result.status === 'fulfilled')
    .map((result) => result.value)
}

function buildFishDistribution(batches: FishBatch[]): FishTypeDistribution[] {
  const distributionMap = new Map<string, number>()

  for (const batch of batches) {
    const key = batch.fish_type || 'Other'
    const current = distributionMap.get(key) ?? 0
    distributionMap.set(key, current + batch.current_quantity)
  }

  return [...distributionMap.entries()]
    .map(([name, value]) => ({
      name,
      value,
      color: '#0891b2',
    }))
    .sort((left, right) => right.value - left.value)
}

function buildSurvivalRateAnalytics(batches: FishBatch[], harvests: Harvest[]): SurvivalRateAnalytics[] {
  const harvestWeightByBatch = new Map<number, number>()

  for (const harvest of harvests) {
    const current = harvestWeightByBatch.get(harvest.fish_batch_id) ?? 0
    harvestWeightByBatch.set(harvest.fish_batch_id, current + harvest.total_weight)
  }

  return batches.map((batch) => ({
    batch_id: batch.id,
    batch_code: batch.batch_code,
    fish_type: batch.fish_type,
    initial_quantity: batch.initial_quantity,
    current_quantity: batch.current_quantity,
    survival_rate: normalizeRatio(calculateSurvivalRate(batch)),
    harvest_weight: harvestWeightByBatch.get(batch.id) ?? 0,
    pond_name: batch.pond_name,
    start_date: batch.stocking_date,
  }))
}

function buildPondProductivity(
  ponds: Pond[],
  batches: FishBatch[],
  harvests: Harvest[],
  params?: DateFilterRange,
): PondProductivityData[] {
  const filteredBatches = batches.filter((batch) =>
    matchesDateRange(batch.stocking_date || batch.created_at, params),
  )
  const filteredHarvests = harvests.filter((harvest) => matchesDateRange(harvest.harvest_date, params))
  const batchesByPond = new Map<number, FishBatch[]>()
  const batchById = new Map<number, FishBatch>(batches.map((batch) => [batch.id, batch]))
  const harvestWeightByPond = new Map<number, number>()

  for (const batch of filteredBatches) {
    const current = batchesByPond.get(batch.pond_id) ?? []
    current.push(batch)
    batchesByPond.set(batch.pond_id, current)
  }

  for (const harvest of filteredHarvests) {
    const batch = batchById.get(harvest.fish_batch_id)
    if (!batch) {
      continue
    }

    const current = harvestWeightByPond.get(batch.pond_id) ?? 0
    harvestWeightByPond.set(batch.pond_id, current + harvest.total_weight)
  }

  return ponds
    .map((pond) => {
      const pondBatches = batchesByPond.get(pond.id) ?? []
      const averageSurvivalRate =
        pondBatches.length > 0
          ? pondBatches.reduce((total, batch) => total + normalizeRatio(calculateSurvivalRate(batch)), 0) /
            pondBatches.length
          : 0

      return {
        pond_id: pond.id,
        pond_name: pond.name,
        pond_code: pond.code,
        total_harvest_weight: harvestWeightByPond.get(pond.id) ?? 0,
        total_batches: pondBatches.length,
        completed_batches: pondBatches.filter((batch) => batch.status === 'Harvested').length,
        average_survival_rate: averageSurvivalRate,
      }
    })
    .filter((item) => item.total_batches > 0 || item.total_harvest_weight > 0)
    .sort((left, right) => right.total_harvest_weight - left.total_harvest_weight)
}

function buildTopSellingFish(orderDetails: OrderDetail[]): TopSellingFish[] {
  const totals = new Map<string, { total_sold: number; total_revenue: number }>()

  for (const order of orderDetails) {
    for (const item of order.items) {
      const key = item.fish_type || 'Other'
      const current = totals.get(key) ?? { total_sold: 0, total_revenue: 0 }
      current.total_sold += item.quantity
      current.total_revenue += item.subtotal
      totals.set(key, current)
    }
  }

  const totalSold = [...totals.values()].reduce((sum, item) => sum + item.total_sold, 0)

  return [...totals.entries()]
    .map(([fish_type, item]) => ({
      fish_type,
      total_sold: item.total_sold,
      total_revenue: item.total_revenue,
      percentage: totalSold > 0 ? (item.total_sold / totalSold) * 100 : 0,
    }))
    .sort((left, right) => right.total_sold - left.total_sold)
}

function buildInventoryTrend(
  dates: string[],
  inventories: Inventory[],
  productMap: Map<number, ProductMapValue>,
) {
  const byDate = groupByDate(inventories, (item) => item.updated_at || item.created_at)

  return dates.map((date) => {
    const items = byDate.get(date) ?? []
    return {
      date,
      total_inventory: items.length,
      inventory_value: items.reduce((total, item) => {
        const price = item.product_id ? productMap.get(item.product_id)?.price ?? 0 : 0
        return total + item.stock * price
      }, 0),
      low_stock_items: items.filter((item) => item.stock > 0 && item.stock <= item.minimum_stock).length,
      out_of_stock: items.filter((item) => item.stock <= 0).length,
    }
  })
}

async function buildInsights(params?: DateFilterRange): Promise<InsightCardData> {
  const [sales, customers, feeding, pondItems, batchItems, harvestItems, batchReport, harvestReport] =
    await Promise.all([
      dashboardService.getSales().catch(() => null),
      reportService.getCustomerReport(normalizeFilter(params)),
      reportService.getFeedingReport(normalizeFilter(params)),
      fetchAllPonds(),
      fetchAllFishBatches(),
      fetchAllHarvests(params),
      reportService.getFishBatchReport(normalizeFilter(params)),
      reportService.getHarvestReport(normalizeFilter(params)),
    ])

  const productivity = buildPondProductivity(pondItems, batchItems, harvestItems, params)
  const mostProductivePond = productivity[0]
  const bestBatch = [...batchReport.rows].sort((left, right) => right.survival_rate - left.survival_rate)[0]
  const mostActiveCustomer = [...customers.rows]
    .sort((left, right) => right.orders - left.orders || right.total_spending - left.total_spending)[0]

  return {
    top_revenue_product: {
      name: sales?.top_selling_product?.product_name || 'Tidak ada data',
      revenue: sales?.top_selling_product?.revenue ?? 0,
    },
    most_productive_pond: {
      name: mostProductivePond?.pond_name || 'Tidak ada data',
      harvest_weight: mostProductivePond?.total_harvest_weight ?? harvestReport.summary.total_weight,
    },
    best_survival_rate_batch: {
      batch_code: bestBatch?.batch_code || 'Tidak ada data',
      survival_rate: normalizeRatio(bestBatch?.survival_rate ?? 0),
      fish_type: bestBatch?.fish_type || '-',
    },
    most_used_feed: {
      feed_type: feeding.summary.most_used_feed || 'Tidak ada data',
      total_used: feeding.rows
        .filter((row) => row.feed_type === feeding.summary.most_used_feed)
        .reduce((sum, row) => sum + row.total_feed, 0),
    },
    most_active_customer: {
      name: mostActiveCustomer?.customer || 'Tidak ada data',
      total_orders: mostActiveCustomer?.orders ?? 0,
      total_spent: mostActiveCustomer?.total_spending ?? 0,
    },
  }
}

export const analyticsService = {
  async getRevenueAnalytics(params?: DateFilterRange): Promise<RevenueAnalyticsResponse> {
    const filter = normalizeFilter(params)
    const [sales, customers, feeding, harvests, fishBatches, insights] = await Promise.all([
      reportService.getSalesReport(filter),
      reportService.getCustomerReport(filter),
      reportService.getFeedingReport(filter),
      reportService.getHarvestReport(filter),
      reportService.getFishBatchReport(filter),
      buildInsights(params),
    ])

    const kpi: KpiCardData = {
      total_revenue: sales.summary.total_revenue,
      total_orders: sales.summary.total_orders,
      total_customers: customers.summary.active_customers,
      total_harvest_weight: harvests.summary.total_weight,
      average_survival_rate: normalizeRatio(fishBatches.summary.average_survival_rate),
      total_feed_used: feeding.summary.total_feed_used,
    }

    return {
      kpi,
      trend: sales.trend.map((item) => ({
        date: item.date,
        revenue: item.revenue,
        orders: item.orders,
      })),
      insights,
    }
  },

  async getOrderAnalytics(params?: DateFilterRange): Promise<OrderAnalyticsResponse> {
    const { orders, summary } = await fetchAllOrders(params)
    const dates = createDateSeries(params)
    const grouped = groupByDate(orders, (item) => item.created_at)

    return {
      trend: dates.map((date) => {
        const items = grouped.get(date) ?? []
        return {
          date,
          orders: items.length,
          completed_orders: items.filter((item) => item.status === 'Completed').length,
          revenue: items.reduce((total, item) => total + item.total_amount, 0),
        }
      }),
      summary: {
        total_orders: summary.total_orders,
        completed_orders: summary.completed_orders,
        pending_orders: summary.pending_orders + summary.processing_orders,
        average_order_value:
          summary.total_orders > 0 ? summary.total_revenue / summary.total_orders : 0,
      },
    }
  },

  async getCustomerAnalytics(params?: DateFilterRange): Promise<CustomerAnalyticsResponse> {
    const [users, { orders }] = await Promise.all([fetchAllUsers(), fetchAllOrders(params)])
    const customers = users.filter((user) => user.role.toLowerCase() === 'customer')
    const activeCustomers = customers.filter((user) => user.status.toLowerCase() === 'active')
    const dates = createDateSeries(params)
    const signups = groupByDate(
      customers.filter((user) => matchesDateRange(user.created_at, params)),
      (user) => user.created_at,
    )

    return {
      trend: dates.map((date) => {
        const newCustomers = signups.get(date) ?? []
        const endOfDay = new Date(`${date}T23:59:59.999Z`)
        const totalCustomers = customers.filter((user) => {
          const createdAt = new Date(user.created_at)
          return !Number.isNaN(createdAt.getTime()) && createdAt <= endOfDay
        }).length
        const totalActiveCustomers = activeCustomers.filter((user) => {
          const createdAt = new Date(user.created_at)
          return !Number.isNaN(createdAt.getTime()) && createdAt <= endOfDay
        }).length

        return {
          date,
          new_customers: newCustomers.length,
          total_customers: totalCustomers,
          active_customers: totalActiveCustomers,
        }
      }),
      summary: {
        total_customers: customers.length,
        new_customers_this_period: customers.filter((user) => matchesDateRange(user.created_at, params)).length,
        active_customers: activeCustomers.length,
        average_orders_per_customer: customers.length > 0 ? orders.length / customers.length : 0,
      },
    }
  },

  async getHarvestAnalytics(params?: DateFilterRange): Promise<HarvestAnalyticsResponse> {
    const filter = normalizeFilter(params)
    const [report, batches, harvests, ponds] = await Promise.all([
      reportService.getHarvestReport(filter),
      fetchAllFishBatches(),
      fetchAllHarvests(params),
      fetchAllPonds(),
    ])
    const productivity = buildPondProductivity(ponds, batches, harvests, params)
    const survivalRate = buildSurvivalRateAnalytics(
      batches.filter((batch) => matchesDateRange(batch.stocking_date || batch.created_at, params)),
      harvests,
    )

    return {
      trend: report.trend.map((item) => ({
        date: item.date,
        total_harvest: item.harvest_count,
        total_weight: item.total_weight,
        average_survival_rate: 0,
      })),
      productivity,
      survival_rate: survivalRate,
      summary: {
        total_harvest: report.summary.total_harvest,
        total_weight: report.summary.total_weight,
        average_survival_rate: normalizeRatio(report.summary.average_survival_rate),
        total_batches: survivalRate.length,
      },
    }
  },

  async getFeedingAnalytics(params?: DateFilterRange): Promise<FeedingAnalyticsResponse> {
    const report = await reportService.getFeedingReport(normalizeFilter(params))

    return {
      trend: report.trend.map((item) => ({
        date: item.date,
        total_feed: item.total_feed,
        activities: item.activities,
        average_per_activity: item.activities > 0 ? item.total_feed / item.activities : 0,
      })),
      distribution: report.rows.map((item) => ({
        name: item.feed_type,
        value: item.total_feed,
        color: '#0891b2',
      })),
      summary: report.summary,
    }
  },

  async getInventoryAnalytics(params?: DateFilterRange): Promise<InventoryAnalyticsResponse> {
    const [inventory, productMap] = await Promise.all([
      inventoryService.getInventories({ page: 1, limit: 1000 }),
      getProductMap(),
    ])
    const items = inventory.items.filter((item) =>
      matchesDateRange(item.updated_at || item.created_at, params),
    )
    const dates = createDateSeries(params)

    return {
      trend: buildInventoryTrend(dates, items, productMap),
      analytics: items.map((item) => ({
        product_id: item.product_id ?? item.id,
        product_name: item.name,
        fish_type: item.product_id ? productMap.get(item.product_id)?.category ?? item.category : item.category,
        current_stock: item.stock,
        minimum_stock: item.minimum_stock,
        status:
          item.stock <= 0 ? 'out_of_stock' : item.stock <= item.minimum_stock ? 'low' : 'adequate',
        last_updated: item.updated_at || item.created_at,
        unit: item.unit,
      })),
      summary: {
        total_inventory: items.length,
        inventory_value: items.reduce((total, item) => {
          const price = item.product_id ? productMap.get(item.product_id)?.price ?? 0 : 0
          return total + item.stock * price
        }, 0),
        low_stock_items: items.filter((item) => item.stock > 0 && item.stock <= item.minimum_stock).length,
        out_of_stock: items.filter((item) => item.stock <= 0).length,
      },
    }
  },

  async getPondAnalytics(params?: DateFilterRange): Promise<PondAnalyticsResponse> {
    const [ponds, batches, harvests] = await Promise.all([
      fetchAllPonds(),
      fetchAllFishBatches(),
      fetchAllHarvests(params),
    ])
    const productivity = buildPondProductivity(ponds, batches, harvests, params)
    const totalHarvestWeight = productivity.reduce((sum, item) => sum + item.total_harvest_weight, 0)

    return {
      productivity,
      summary: {
        total_ponds: ponds.length,
        active_ponds: ponds.filter((pond) => pond.status === 'Active').length,
        total_harvest_weight: totalHarvestWeight,
        average_productivity: productivity.length > 0 ? totalHarvestWeight / productivity.length : 0,
      },
    }
  },

  async getFishBatchAnalytics(params?: DateFilterRange): Promise<FishBatchAnalyticsResponse> {
    const [batches, { orders }] = await Promise.all([
      fetchAllFishBatches(),
      fetchAllOrders(params),
    ])
    const filteredBatches = batches.filter((batch) =>
      matchesDateRange(batch.stocking_date || batch.created_at, params),
    )
    const orderDetails = await fetchOrderDetails(orders)

    return {
      distribution: buildFishDistribution(filteredBatches),
      top_selling: buildTopSellingFish(orderDetails),
      summary: {
        total_batches: filteredBatches.length,
        growing_batches: filteredBatches.filter((batch) => batch.status === 'Growing').length,
        harvested_batches: filteredBatches.filter((batch) => batch.status === 'Harvested').length,
        average_survival_rate:
          filteredBatches.length > 0
            ? filteredBatches.reduce((sum, batch) => sum + normalizeRatio(calculateSurvivalRate(batch)), 0) /
              filteredBatches.length
            : 0,
      },
    }
  },
}
