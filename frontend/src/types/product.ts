export const PRODUCT_CATEGORIES = [
  'Nila',
  'Lele',
  'Patin',
  'Gurame',
  'Bawal',
  'Bandeng',
] as const

export const PRODUCT_STATUS_OPTIONS = [
  'available',
  'out_of_stock',
  'hidden',
] as const

export const PRODUCT_SORT_OPTIONS = [
  'newest',
  'oldest',
  'highest_price',
  'lowest_price',
  'stock',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
export type ProductStatus = (typeof PRODUCT_STATUS_OPTIONS)[number]
export type ProductSortOption = (typeof PRODUCT_SORT_OPTIONS)[number]

export interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  weight: number
  image_url: string
  status: string
  created_at: string
  updated_at: string
  batch_code: string
  farm_name: string
  pond_name: string
  harvest_date: string
}

export interface ProductListMeta {
  page: number
  limit: number
  total: number
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
}

export interface ProductListResult {
  items: Product[]
  meta: ProductListMeta
}

export interface ProductMutationInput {
  name: string
  description: string
  price: number
  stock: number
  category: string
  weight: number
  status: ProductStatus
  image?: File | null
  image_url?: string
}
