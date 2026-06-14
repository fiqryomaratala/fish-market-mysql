import api from '@/api/axios'
import type { ApiResponse, ProductPayload } from '@/types/api'
import type { Product } from '@/types/product'

type ProductApiRecord = Partial<Product> & {
  imageUrl?: string
  batchCode?: string
  farmName?: string
  pondName?: string
  harvestDate?: string
}

type ProductListEnvelope = {
  data?: {
    items?: ProductApiRecord[]
    meta?: {
      page?: number
      limit?: number
      total?: number
    }
  }
  message?: string
}

type ProductDetailEnvelope = {
  data?: ProductApiRecord
  message?: string
}

const FALLBACK_PLACEHOLDER_IMAGE = 'https://placehold.co/1200x900?text=Fish'

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function resolveImageUrl(imageUrl: string) {
  if (!imageUrl) {
    return ''
  }

  if (/^https?:\/\//i.test(imageUrl)) {
    return imageUrl
  }

  const apiUrl = import.meta.env.VITE_API_URL

  if (!apiUrl) {
    return imageUrl
  }

  try {
    const parsedApiUrl = new URL(apiUrl)
    return new URL(imageUrl, parsedApiUrl.origin).toString()
  } catch {
    return imageUrl
  }
}

function mapProduct(record: ProductApiRecord, fallbackId = 0): Product {
  return {
    id: toNumber(record.id, fallbackId),
    name: toStringValue(record.name, 'Produk'),
    description: toStringValue(record.description),
    price: toNumber(record.price),
    stock: toNumber(record.stock),
    image_url: resolveImageUrl(
      toStringValue(record.image_url) || toStringValue(record.imageUrl),
    ),
    batch_code: toStringValue(record.batch_code) || toStringValue(record.batchCode),
    farm_name: toStringValue(record.farm_name) || toStringValue(record.farmName),
    pond_name: toStringValue(record.pond_name) || toStringValue(record.pondName),
    harvest_date:
      toStringValue(record.harvest_date) || toStringValue(record.harvestDate),
    category: toStringValue(record.category),
    weight: toStringValue(record.weight),
    status: toStringValue(record.status, toNumber(record.stock) > 0 ? 'available' : 'empty'),
  }
}

class ProductService {
  async getProducts(): Promise<Product[]> {
    const { data } = await api.get<ProductListEnvelope>('/products', {
      params: {
        page: 1,
        limit: 100,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []

    return items.map((item, index) => mapProduct(item, index + 1))
  }

  async getProductById(id: number): Promise<Product> {
    const { data } = await api.get<ProductDetailEnvelope>(`/products/${id}`)

    if (!data.data) {
      throw new Error('Product not found')
    }

    return mapProduct(data.data, id)
  }

  async getAll() {
    const products = await this.getProducts()

    return {
      data: products,
      message: 'Products fetched successfully',
    }
  }

  async getById(id: string) {
    const product = await this.getProductById(Number(id))

    return {
      data: product,
      message: 'Product fetched successfully',
    }
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
export { FALLBACK_PLACEHOLDER_IMAGE }
