import api from '@/api/axios'
import type {
  ApiListResponse,
  ApiResponse,
  ListQueryParams,
  Product,
  ProductPayload,
} from '@/types/api'

class ProductService {
  async getAll(params?: ListQueryParams) {
    const { data } = await api.get<ApiListResponse<Product>>('/products', { params })
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
}

export const productService = new ProductService()
