export type Identifier = string

export type ApiResponse<T> = {
  data: T
  message: string
}

export type ApiListResponse<T> = {
  data: T[]
  message: string
  meta?: {
    page: number
    limit: number
    total: number
  }
}

export type ListQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  [key: string]: string | number | boolean | undefined
}

export type UserRole = 'admin' | 'customer'

export type UserProfile = {
  id: Identifier
  name: string
  email: string
  role: UserRole
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  passwordConfirmation?: string
}

export type AuthResponse = {
  token: string
  refreshToken?: string
  user: UserProfile
}

export type Product = {
  id: Identifier
  name: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  category?: string
  status?: string
}

export type ProductPayload = Omit<Product, 'id'>

export type InventoryItem = {
  id: Identifier
  name: string
  quantity: number
  unit: string
  location?: string
  status?: string
}

export type InventoryPayload = Omit<InventoryItem, 'id'>

export type Pond = {
  id: Identifier
  name: string
  location?: string
  capacity: number
  waterQualityStatus?: string
  status?: string
}

export type PondPayload = Omit<Pond, 'id'>

export type FishBatch = {
  id: Identifier
  code: string
  pondId: Identifier
  species: string
  quantity: number
  averageWeight?: number
  status?: string
  stockedAt?: string
}

export type FishBatchPayload = Omit<FishBatch, 'id'>

export type FeedingRecord = {
  id: Identifier
  pondId?: Identifier
  fishBatchId?: Identifier
  feedType: string
  feedAmount: number
  feedingTime: string
  notes?: string
}

export type FeedingPayload = Omit<FeedingRecord, 'id'>

export type HarvestRecord = {
  id: Identifier
  pondId?: Identifier
  fishBatchId?: Identifier
  harvestDate: string
  quantity: number
  averageWeight?: number
  notes?: string
}

export type HarvestPayload = Omit<HarvestRecord, 'id'>

export type DashboardSummary = {
  totalSales: number
  totalOrders: number
  activePonds: number
  activeFishBatches: number
  lowStockItems: number
}

export type DashboardSalesMetrics = {
  revenue: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
}

export type DashboardFarmMetrics = {
  pondUtilization: number
  feedUsage: number
  harvestVolume: number
  mortalityRate: number
}

export type ReportRecord = {
  id: Identifier
  title: string
  type: string
  generatedAt: string
  generatedBy?: string
  fileUrl?: string
}

export type ReportPayload = {
  type: string
  startDate?: string
  endDate?: string
  format?: 'pdf' | 'csv' | 'xlsx'
}

export type AppNotification = {
  id: Identifier
  title: string
  message: string
  isRead: boolean
  createdAt: string
  type?: string
}

export type ActivityLog = {
  id: Identifier
  actorName: string
  action: string
  module: string
  createdAt: string
  metadata?: Record<string, string | number | boolean | null>
}

export type OrderItemPayload = {
  productId: Identifier
  quantity: number
  price: number
}

export type Order = {
  id: Identifier
  customerId?: Identifier
  status: string
  totalAmount: number
  items: OrderItemPayload[]
  shippingAddress?: string
  createdAt?: string
}

export type OrderPayload = Omit<Order, 'id' | 'createdAt'>

export type OrderStatusPayload = {
  status: string
}
