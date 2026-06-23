import api from '@/api/axios'
import { fishBatchService } from '@/services/fish-batch.service'
import { feedingLogService } from '@/services/feeding-log.service'
import { harvestService } from '@/services/harvest.service'
import { inventoryService } from '@/services/inventory.service'
import { orderManagementService } from '@/services/order-management.service'
import { productService } from '@/services/product.service'
import { userService } from '@/services/user.service'
import {
  calculateSurvivalRate,
  type FishBatch,
} from '@/types/fish-batch'
import type { Product } from '@/types/product'
import type {
  CustomerReport,
  FeedingReport,
  FishBatchReport,
  HarvestReport,
  InventoryReport,
  ReportDateFilter,
  ReportExportType,
  SalesReport,
} from '@/types/report'

type BackendEnvelope<T> = {
  data?: T
  message?: string
  success?: boolean
}

type BackendHarvestReportItem = {
  batch_code: string
  pond: string
  fish_type: string
  harvest_date: string
  fish_count: number
  total_weight: number
}

type BackendFeedingReportItem = {
  batch_code: string
  feed_type: string
  total_feed: number
}

function toNumeric(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function sortByDateDesc<T>(items: T[], getValue: (item: T) => string) {
  return [...items].sort((left, right) => {
    const leftDate = new Date(getValue(left)).getTime()
    const rightDate = new Date(getValue(right)).getTime()
    return rightDate - leftDate
  })
}

function matchesDateRange(value: string, filter: ReportDateFilter) {
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

async function fetchAllOrders(filter: ReportDateFilter) {
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
  const users = [...firstPage.items]
  const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.limit))

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await userService.getUsers({ page, limit: 100 })
    users.push(...response.items)
  }

  return users
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

async function fetchAllFeedingLogs(filter: ReportDateFilter) {
  const firstPage = await feedingLogService.getFeedingLogs({
    page: 1,
    limit: 100,
    start_date: filter.start_date,
    end_date: filter.end_date,
  })
  const items = [...firstPage.items]
  const totalPages = Math.max(1, Math.ceil(firstPage.meta.total / firstPage.meta.limit))

  for (let page = 2; page <= totalPages; page += 1) {
    const response = await feedingLogService.getFeedingLogs({
      page,
      limit: 100,
      start_date: filter.start_date,
      end_date: filter.end_date,
    })
    items.push(...response.items)
  }

  return items
}

async function fetchAllHarvests(filter: ReportDateFilter) {
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

async function getProductPriceMap() {
  const products = await productService.getProducts({ page: 1, limit: 1000 }, { admin: true })
  return new Map<number, Product>(products.items.map((product) => [product.id, product]))
}

function getFileNameFromDisposition(dispositionHeader?: string | null) {
  if (!dispositionHeader) {
    return null
  }

  const utfMatch = dispositionHeader.match(/filename\*=UTF-8''([^;]+)/i)
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1])
  }

  const simpleMatch = dispositionHeader.match(/filename="?([^"]+)"?/i)
  return simpleMatch?.[1] ?? null
}

async function downloadReportFile(
  endpoint: '/reports/export/pdf' | '/reports/export/excel',
  type: ReportExportType,
  filter: ReportDateFilter,
  fallbackName: string,
) {
  const response = await api.get<Blob>(endpoint, {
    params: {
      type,
      start_date: filter.start_date,
      end_date: filter.end_date,
    },
    responseType: 'blob',
  })

  const fileName =
    getFileNameFromDisposition(response.headers['content-disposition']) ?? fallbackName
  const objectUrl = window.URL.createObjectURL(response.data)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(objectUrl)
}

class ReportService {
  async getSalesReport(filter: ReportDateFilter = {}): Promise<SalesReport> {
    const { orders, summary } = await fetchAllOrders(filter)
    const grouped = new Map<string, { date: string; revenue: number; orders: number }>()

    for (const order of orders) {
      const dateKey = toDateKey(order.created_at)
      const current = grouped.get(dateKey) ?? { date: dateKey, revenue: 0, orders: 0 }
      current.revenue += order.total_amount
      current.orders += 1
      grouped.set(dateKey, current)
    }

    return {
      summary: {
        total_revenue: summary.total_revenue,
        total_orders: summary.total_orders,
        average_order_value:
          summary.total_orders > 0 ? summary.total_revenue / summary.total_orders : 0,
        completed_orders: summary.completed_orders,
      },
      trend: [...grouped.values()].sort((left, right) => left.date.localeCompare(right.date)),
      rows: sortByDateDesc(orders, (item) => item.created_at).map((item) => ({
        id: item.id,
        invoice: item.invoice_number,
        customer: item.customer_name,
        total: item.total_amount,
        status: item.status,
        date: item.created_at,
      })),
    }
  }

  async getHarvestReport(filter: ReportDateFilter = {}): Promise<HarvestReport> {
    const [reportResponse, harvests, batches] = await Promise.all([
      api.get<BackendEnvelope<BackendHarvestReportItem[]>>('/reports/harvest', {
        params: {
          start_date: filter.start_date,
          end_date: filter.end_date,
        },
      }),
      fetchAllHarvests(filter),
      fetchAllFishBatches(),
    ])

    const items = reportResponse.data.data ?? []
    const batchMap = new Map<string, FishBatch>(batches.map((batch) => [batch.batch_code, batch]))
    const trendMap = new Map<string, { date: string; total_weight: number; harvest_count: number }>()

    for (const item of items) {
      const dateKey = toDateKey(item.harvest_date)
      const current = trendMap.get(dateKey) ?? { date: dateKey, total_weight: 0, harvest_count: 0 }
      current.total_weight += toNumeric(item.total_weight)
      current.harvest_count += 1
      trendMap.set(dateKey, current)
    }

    const averageSurvivalRate =
      harvests.length > 0
        ? harvests.reduce((total, harvest) => total + harvest.survival_rate, 0) / harvests.length
        : 0

    return {
      summary: {
        total_harvest: harvests.reduce((total, harvest) => total + harvest.total_quantity, 0),
        total_weight: items.reduce((total, item) => total + toNumeric(item.total_weight), 0),
        average_survival_rate: averageSurvivalRate,
        harvest_count: harvests.length,
      },
      trend: [...trendMap.values()].sort((left, right) => left.date.localeCompare(right.date)),
      rows: sortByDateDesc(harvests, (item) => item.harvest_date).map((item) => ({
        id: item.id,
        harvest_code: item.harvest_code,
        batch_code: item.batch_code,
        fish_type: item.fish_type || batchMap.get(item.batch_code)?.fish_type || '-',
        weight: item.total_weight,
        survival_rate: item.survival_rate,
        date: item.harvest_date,
      })),
    }
  }

  async getInventoryReport(filter: ReportDateFilter = {}): Promise<InventoryReport> {
    const [inventory, productMap] = await Promise.all([
      inventoryService.getInventories({ page: 1, limit: 1000 }),
      getProductPriceMap(),
    ])

    const filteredRows = inventory.items.filter((item) =>
      matchesDateRange(item.updated_at || item.created_at, filter),
    )

    return {
      summary: {
        total_inventory: filteredRows.length,
        low_stock_items: filteredRows.filter((item) => item.stock > 0 && item.stock <= item.minimum_stock).length,
        out_of_stock: filteredRows.filter((item) => item.stock <= 0).length,
        inventory_value: filteredRows.reduce((total, item) => {
          const price = item.product_id ? productMap.get(item.product_id)?.price ?? 0 : 0
          return total + price * item.stock
        }, 0),
      },
      rows: filteredRows.map((item) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        category: item.category,
        stock: item.stock,
        minimum_stock: item.minimum_stock,
        status: item.status,
      })),
    }
  }

  async getFeedingReport(filter: ReportDateFilter = {}): Promise<FeedingReport> {
    const [reportResponse, feedingLogs] = await Promise.all([
      api.get<BackendEnvelope<BackendFeedingReportItem[]>>('/reports/feeding'),
      fetchAllFeedingLogs(filter),
    ])

    const rows = reportResponse.data.data ?? []
    const trendMap = new Map<string, { date: string; total_feed: number; activities: number }>()
    const feedUsageMap = new Map<string, number>()

    for (const log of feedingLogs) {
      const dateKey = toDateKey(log.feeding_time)
      const current = trendMap.get(dateKey) ?? { date: dateKey, total_feed: 0, activities: 0 }
      current.total_feed += log.quantity
      current.activities += 1
      trendMap.set(dateKey, current)

      const usage = feedUsageMap.get(log.feed_type) ?? 0
      feedUsageMap.set(log.feed_type, usage + log.quantity)
    }

    const totalFeedUsed = rows.reduce((total, item) => total + toNumeric(item.total_feed), 0)
    const mostUsedFeed =
      [...feedUsageMap.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? '-'

    return {
      summary: {
        total_feed_used: totalFeedUsed,
        average_feed_usage: feedingLogs.length > 0 ? totalFeedUsed / feedingLogs.length : 0,
        most_used_feed: mostUsedFeed,
        feeding_activities: feedingLogs.length,
      },
      trend: [...trendMap.values()].sort((left, right) => left.date.localeCompare(right.date)),
      rows: rows.map((item) => ({
        batch_code: item.batch_code,
        feed_type: item.feed_type,
        total_feed: toNumeric(item.total_feed),
      })),
    }
  }

  async getFishBatchReport(filter: ReportDateFilter = {}): Promise<FishBatchReport> {
    const batches = await fetchAllFishBatches()
    const filteredRows = batches.filter((item) =>
      matchesDateRange(item.stocking_date || item.created_at, filter),
    )
    const averageSurvivalRate =
      filteredRows.length > 0
        ? filteredRows.reduce((total, batch) => total + calculateSurvivalRate(batch), 0) /
          filteredRows.length
        : 0

    return {
      summary: {
        total_batch: filteredRows.length,
        growing_batch: filteredRows.filter((item) => item.status === 'Growing').length,
        harvested_batch: filteredRows.filter((item) => item.status === 'Harvested').length,
        average_survival_rate: averageSurvivalRate,
      },
      rows: filteredRows.map((item) => ({
        id: item.id,
        batch_code: item.batch_code,
        fish_type: item.fish_type,
        pond: item.pond_name,
        current_qty: item.current_quantity,
        survival_rate: calculateSurvivalRate(item),
        status: item.status,
      })),
    }
  }

  async getCustomerReport(filter: ReportDateFilter = {}): Promise<CustomerReport> {
    const [users, { orders, summary }] = await Promise.all([fetchAllUsers(), fetchAllOrders(filter)])
    const customers = users.filter((user) => user.role.toLowerCase() === 'customer')
    const activeCustomers = customers.filter((user) => user.status.toLowerCase() === 'active').length
    const customerMap = new Map<string, { customer: string; orders: number; total_spending: number; last_order: string }>()

    for (const order of orders) {
      const key = order.customer_email || `${order.customer_name}-${order.id}`
      const current = customerMap.get(key) ?? {
        customer: order.customer_name,
        orders: 0,
        total_spending: 0,
        last_order: order.created_at,
      }

      current.orders += 1
      current.total_spending += order.total_amount
      if (!current.last_order || new Date(order.created_at) > new Date(current.last_order)) {
        current.last_order = order.created_at
      }

      customerMap.set(key, current)
    }

    const rows = [...customerMap.entries()]
      .map(([key, value]) => ({
        key,
        customer: value.customer,
        orders: value.orders,
        total_spending: value.total_spending,
        last_order: value.last_order,
      }))
      .sort((left, right) => right.total_spending - left.total_spending)

    return {
      summary: {
        total_customers: customers.length,
        active_customers: activeCustomers,
        total_orders: summary.total_orders,
        average_spending: rows.length > 0 ? summary.total_revenue / rows.length : 0,
      },
      rows,
    }
  }

  async exportPdf(type: ReportExportType, filter: ReportDateFilter = {}) {
    await downloadReportFile('/reports/export/pdf', type, filter, `${type}-report.pdf`)
  }

  async exportExcel(type: ReportExportType, filter: ReportDateFilter = {}) {
    await downloadReportFile('/reports/export/excel', type, filter, `${type}-report.xlsx`)
  }
}

export const reportService = new ReportService()
