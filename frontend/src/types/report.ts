import type { FishBatchStatus } from '@/types/fish-batch'

export type ReportTabKey =
  | 'sales'
  | 'harvest'
  | 'inventory'
  | 'feeding'
  | 'fish-batches'
  | 'customers'

export type ReportExportType = 'harvest' | 'production' | 'feeding'

export type ReportDateFilter = {
  start_date?: string
  end_date?: string
}

export type QuickFilterKey = 'today' | 'last-7-days' | 'last-30-days' | 'this-month' | 'this-year'

export interface SalesTrendPoint {
  date: string
  revenue: number
  orders: number
}

export interface SalesReportRow {
  id: number
  invoice: string
  customer: string
  total: number
  status: string
  date: string
}

export interface SalesReport {
  summary: {
    total_revenue: number
    total_orders: number
    average_order_value: number
    completed_orders: number
  }
  trend: SalesTrendPoint[]
  rows: SalesReportRow[]
}

export interface HarvestTrendPoint {
  date: string
  total_weight: number
  harvest_count: number
}

export interface HarvestReportRow {
  id: number
  harvest_code: string
  batch_code: string
  fish_type: string
  weight: number
  survival_rate: number
  date: string
}

export interface HarvestReport {
  summary: {
    total_harvest: number
    total_weight: number
    average_survival_rate: number
    harvest_count: number
  }
  trend: HarvestTrendPoint[]
  rows: HarvestReportRow[]
}

export interface InventoryReportRow {
  id: number
  sku: string
  name: string
  category: string
  stock: number
  minimum_stock: number
  status: string
}

export interface InventoryReport {
  summary: {
    total_inventory: number
    low_stock_items: number
    out_of_stock: number
    inventory_value: number
  }
  rows: InventoryReportRow[]
}

export interface FeedingTrendPoint {
  date: string
  total_feed: number
  activities: number
}

export interface FeedingBreakdownRow {
  batch_code: string
  feed_type: string
  total_feed: number
}

export interface FeedingReport {
  summary: {
    total_feed_used: number
    average_feed_usage: number
    most_used_feed: string
    feeding_activities: number
  }
  trend: FeedingTrendPoint[]
  rows: FeedingBreakdownRow[]
}

export interface FishBatchReportRow {
  id: number
  batch_code: string
  fish_type: string
  pond: string
  current_qty: number
  survival_rate: number
  status: FishBatchStatus
}

export interface FishBatchReport {
  summary: {
    total_batch: number
    growing_batch: number
    harvested_batch: number
    average_survival_rate: number
  }
  rows: FishBatchReportRow[]
}

export interface CustomerReportRow {
  key: string
  customer: string
  orders: number
  total_spending: number
  last_order: string
}

export interface CustomerReport {
  summary: {
    total_customers: number
    active_customers: number
    total_orders: number
    average_spending: number
  }
  rows: CustomerReportRow[]
}
