export interface CustomerDashboardSummary {
  total_orders: number
  completed_orders: number
  pending_orders: number
  total_spending: number
}

export type DashboardSummary = CustomerDashboardSummary

export interface AdminDashboardSummaryMetrics {
  total_revenue: number
  total_orders: number
  total_products: number
  total_customers: number
  total_batches: number
  total_ponds: number
}

export interface AdminDashboardSummaryResponse {
  summary: AdminDashboardSummaryMetrics
}

export interface SalesChartPoint {
  date: string
  revenue: number
  orders: number
}

export interface TopSellingProductData {
  product_id: number
  product_name: string
  image_url: string
  sold: number
  revenue: number
}

export interface SalesChartResponse {
  series: SalesChartPoint[]
  top_selling_product?: TopSellingProductData | null
}

export interface HarvestChartPoint {
  month: string
  total_weight: number
}

export interface HarvestScheduleItem {
  batch_code: string
  pond: string
  harvest_date: string
  status: string
}

export interface HarvestChartResponse {
  chart: HarvestChartPoint[]
  schedule: HarvestScheduleItem[]
}

export interface LatestOrderItem {
  id: number
  invoice: string
  customer: string
  total: number
  status: string
  date: string
}

export interface InventoryAlertItem {
  id: number
  product_id: number
  product: string
  batch_code: string
  quantity: number
  unit: string
  status: string
}

export interface ActivityLogItem {
  id: number
  user: string
  title: string
  description: string
  module: string
  action: string
  created_at: string
}
