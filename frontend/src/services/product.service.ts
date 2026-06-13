import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  ListQueryParams,
  Product as ApiProduct,
  ProductPayload,
} from '@/types/api'
import type { Product, ProductListParams } from '@/types/product'

const marketplaceDummyProducts: Product[] = [
  {
    id: 1,
    name: 'Nila Premium',
    price: 42000,
    stock: 120,
    image_url:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-NIL-2401',
    farm_name: 'Kolam Tirta Nusantara',
    harvest_date: '2026-06-10',
    category: 'Freshwater',
    availability: 'In Stock',
    harvest_status: 'Fresh Harvest',
    rating: 4.8,
    sold_count: 260,
  },
  {
    id: 2,
    name: 'Lele Jumbo',
    price: 31000,
    stock: 90,
    image_url:
      'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-LEL-2402',
    farm_name: 'Budidaya Mina Jaya',
    harvest_date: '2026-06-07',
    category: 'Freshwater',
    availability: 'In Stock',
    harvest_status: 'Ready Stock',
    rating: 4.6,
    sold_count: 310,
  },
  {
    id: 3,
    name: 'Patin Segar',
    price: 36000,
    stock: 0,
    image_url:
      'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-PAT-2403',
    farm_name: 'Sentra Patin Sumatera',
    harvest_date: '2026-06-18',
    category: 'Freshwater',
    availability: 'Out of Stock',
    harvest_status: 'Upcoming Harvest',
    rating: 4.5,
    sold_count: 180,
  },
  {
    id: 4,
    name: 'Gurame Super',
    price: 58000,
    stock: 45,
    image_url:
      'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-GUR-2404',
    farm_name: 'Gurame Lestari Farm',
    harvest_date: '2026-06-08',
    category: 'Freshwater',
    availability: 'In Stock',
    harvest_status: 'Fresh Harvest',
    rating: 4.9,
    sold_count: 145,
  },
  {
    id: 5,
    name: 'Bawal Air Tawar',
    price: 47000,
    stock: 70,
    image_url:
      'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-BAW-2405',
    farm_name: 'Bawal Makmur',
    harvest_date: '2026-06-11',
    category: 'Freshwater',
    availability: 'In Stock',
    harvest_status: 'Ready Stock',
    rating: 4.7,
    sold_count: 201,
  },
  {
    id: 6,
    name: 'Bandeng',
    price: 39000,
    stock: 62,
    image_url:
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-BDG-2406',
    farm_name: 'Tambak Samudra Sejahtera',
    harvest_date: '2026-06-09',
    category: 'Saltwater',
    availability: 'In Stock',
    harvest_status: 'Fresh Harvest',
    rating: 4.4,
    sold_count: 190,
  },
  {
    id: 7,
    name: 'Kakap Merah',
    price: 86000,
    stock: 28,
    image_url:
      'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-KKM-2407',
    farm_name: 'Laut Merah Aquafarm',
    harvest_date: '2026-06-05',
    category: 'Saltwater',
    availability: 'In Stock',
    harvest_status: 'Ready Stock',
    rating: 4.9,
    sold_count: 124,
  },
  {
    id: 8,
    name: 'Kerapu',
    price: 98000,
    stock: 0,
    image_url:
      'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=900&q=80',
    batch_code: 'BCH-KRP-2408',
    farm_name: 'Blue Reef Hatchery',
    harvest_date: '2026-06-20',
    category: 'Saltwater',
    availability: 'Out of Stock',
    harvest_status: 'Upcoming Harvest',
    rating: 4.8,
    sold_count: 88,
  },
]

class ProductService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<ApiProduct>>('/products', { params })
    return data
  }

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`)
    return data
  }

  async create(payload: ProductPayload) {
    const { data } = await api.post<ApiResponse<Product>>('/products', payload)
    return data
  }

  async update(id: string, payload: Partial<ProductPayload>) {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, payload)
    return data
  }

  async remove(id: string) {
    const { data } = await api.delete<ApiResponse<null>>(`/products/${id}`)
    return data
  }

  async getMarketplaceProducts(params?: ProductListParams) {
    const requestParams = {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      category: params?.category && params.category !== 'All' ? params.category : undefined,
      sort: params?.sort,
    }

    const { data } = await api.get<ApiListResponse<Partial<Product>>>('/products', {
      params: requestParams,
    })

    if (!Array.isArray(data.data) || data.data.length === 0) {
      return {
        ...data,
        data: marketplaceDummyProducts,
        meta: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 8,
          total: marketplaceDummyProducts.length,
        },
      }
    }

    return {
      ...data,
      data: data.data.map((item, index) => ({
        id: Number(item.id ?? index + 1),
        name: item.name ?? marketplaceDummyProducts[index % marketplaceDummyProducts.length].name,
        price: Number(item.price ?? 0),
        stock: Number(item.stock ?? 0),
        image_url:
          item.image_url ??
          marketplaceDummyProducts[index % marketplaceDummyProducts.length].image_url,
        batch_code:
          item.batch_code ??
          marketplaceDummyProducts[index % marketplaceDummyProducts.length].batch_code,
        farm_name:
          item.farm_name ??
          marketplaceDummyProducts[index % marketplaceDummyProducts.length].farm_name,
        harvest_date:
          item.harvest_date ??
          marketplaceDummyProducts[index % marketplaceDummyProducts.length].harvest_date,
        category:
          item.category === 'Saltwater' ? 'Saltwater' : 'Freshwater',
        availability: Number(item.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock',
        harvest_status:
          item.harvest_status === 'Upcoming Harvest' ||
          item.harvest_status === 'Fresh Harvest' ||
          item.harvest_status === 'Ready Stock'
            ? item.harvest_status
            : Number(item.stock ?? 0) > 0
              ? 'Ready Stock'
              : 'Upcoming Harvest',
        rating:
          typeof item.rating === 'number'
            ? item.rating
            : marketplaceDummyProducts[index % marketplaceDummyProducts.length].rating,
        sold_count:
          typeof item.sold_count === 'number'
            ? item.sold_count
            : marketplaceDummyProducts[index % marketplaceDummyProducts.length].sold_count,
      })),
      meta: data.meta ?? {
        page: params?.page ?? 1,
        limit: params?.limit ?? data.data.length,
        total: data.data.length,
      },
    }
  }
}

export const productService = new ProductService()
