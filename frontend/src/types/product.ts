export interface Product {
  id: number
  name: string
  price: number
  stock: number
  image_url: string
  batch_code: string
  farm_name: string
  harvest_date: string
  category: 'Freshwater' | 'Saltwater'
  availability: 'In Stock' | 'Out of Stock'
  harvest_status: 'Fresh Harvest' | 'Ready Stock' | 'Upcoming Harvest'
  rating: number
  sold_count: number
}

export interface ProductListParams {
  page?: number
  limit?: number
  search?: string
  category?: 'All' | Product['category']
  sort?: 'Newest' | 'Lowest Price' | 'Highest Price' | 'Best Selling'
}
