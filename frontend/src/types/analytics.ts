// Types untuk Analytics Dashboard

export type DateFilterKey = 'today' | 'last-7-days' | 'last-30-days' | 'this-month' | 'this-year' | 'custom'

export interface DateFilterRange {
  start_date: string
  end_date: string
}

export interface KpiCardData {
  total_revenue: number
  total_orders: number
  total_customers: number
  total_harvest_weight: number
  average_survival_rate: number
  total_feed_used: number
}

export interface RevenueTrendPoint {
  date: string
  revenue: number
  orders: number
}

export interface OrderTrendPoint {
  date: string
  orders: number
  completed_orders: number
  revenue: number
}

export interface CustomerGrowthPoint {
  date: string
  new_customers: number
  total_customers: number
  active_customers: number
}

export interface HarvestTrendPoint {
  date: string
  total_harvest: number
  total_weight: number
  average_survival_rate: number
}

export interface FeedConsumptionPoint {
  date: string
  total_feed: number
  activities: number
  average_per_activity: number
}

export interface InventoryTrendPoint {
  date: string
  total_inventory: number
  inventory_value: number
  low_stock_items: number
  out_of_stock: number
}

export interface PondProductivityData {
  pond_id: number
  pond_name: string
  pond_code: string
  total_harvest_weight: number
  total_batches: number
  completed_batches: number
  average_survival_rate: number
}

export interface FishTypeDistribution {
  name: string
  value: number
  color: string
}

export interface TopSellingFish {
  fish_type: string
  total_sold: number
  total_revenue: number
  percentage: number
}

export interface SurvivalRateAnalytics {
  batch_id: number
  batch_code: string
  fish_type: string
  initial_quantity: number
  current_quantity: number
  survival_rate: number
  harvest_weight: number
  pond_name: string
  start_date: string
}

export interface InventoryAnalytics {
  product_id: number
  product_name: string
  fish_type: string
  current_stock: number
  minimum_stock: number
  status: 'low' | 'adequate' | 'out_of_stock'
  last_updated: string
  unit: string
}

export interface InsightCardData {
  top_revenue_product: {
    name: string
    revenue: number
  }
  most_productive_pond: {
    name: string
    harvest_weight: number
  }
  best_survival_rate_batch: {
    batch_code: string
    survival_rate: number
    fish_type: string
  }
  most_used_feed: {
    feed_type: string
    total_used: number
  }
  most_active_customer: {
    name: string
    total_orders: number
    total_spent: number
  }
}

export interface RevenueAnalyticsResponse {
  kpi: KpiCardData
  trend: RevenueTrendPoint[]
  insights: InsightCardData
}

export interface OrderAnalyticsResponse {
  trend: OrderTrendPoint[]
  summary: {
    total_orders: number
    completed_orders: number
    pending_orders: number
    average_order_value: number
  }
}

export interface CustomerAnalyticsResponse {
  trend: CustomerGrowthPoint[]
  summary: {
    total_customers: number
    new_customers_this_period: number
    active_customers: number
    average_orders_per_customer: number
  }
}

export interface HarvestAnalyticsResponse {
  trend: HarvestTrendPoint[]
  productivity: PondProductivityData[]
  survival_rate: SurvivalRateAnalytics[]
  summary: {
    total_harvest: number
    total_weight: number
    average_survival_rate: number
    total_batches: number
  }
}

export interface FeedingAnalyticsResponse {
  trend: FeedConsumptionPoint[]
  distribution: FishTypeDistribution[]
  summary: {
    total_feed_used: number
    average_feed_usage: number
    most_used_feed: string
    feeding_activities: number
  }
}

export interface InventoryAnalyticsResponse {
  trend: InventoryTrendPoint[]
  analytics: InventoryAnalytics[]
  summary: {
    total_inventory: number
    inventory_value: number
    low_stock_items: number
    out_of_stock: number
  }
}

export interface PondAnalyticsResponse {
  productivity: PondProductivityData[]
  summary: {
    total_ponds: number
    active_ponds: number
    total_harvest_weight: number
    average_productivity: number
  }
}

export interface FishBatchAnalyticsResponse {
  distribution: FishTypeDistribution[]
  top_selling: TopSellingFish[]
  summary: {
    total_batches: number
    growing_batches: number
    harvested_batches: number
    average_survival_rate: number
  }
}