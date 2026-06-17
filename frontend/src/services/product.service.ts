import api from '@/api/axios'
import type { ApiResponse } from '@/types/api'
import type {
  Product,
  ProductListParams,
  ProductListResult,
  ProductMutationInput,
} from '@/types/product'

type ProductApiRecord = Partial<Product> & {
  imageUrl?: string
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

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export const FALLBACK_PLACEHOLDER_IMAGE = 'https://placehold.co/1200x900?text=Fish'

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

function normalizeStatus(rawStatus: string, stock: number) {
  const normalized = rawStatus.trim().toLowerCase()

  if (normalized === 'hidden') {
    return 'hidden'
  }

  if (normalized === 'out_of_stock' || stock <= 0) {
    return 'out_of_stock'
  }

  return 'available'
}

function mapProduct(record: ProductApiRecord, fallbackId = 0): Product {
  const stock = toNumber(record.stock)

  return {
    id: toNumber(record.id, fallbackId),
    name: toStringValue(record.name, 'Produk'),
    description: toStringValue(record.description),
    price: toNumber(record.price),
    stock,
    category: toStringValue(record.category),
    weight: toNumber(record.weight),
    image_url: resolveImageUrl(
      toStringValue(record.image_url) || toStringValue(record.imageUrl),
    ),
    status: normalizeStatus(toStringValue(record.status), stock),
    created_at: toStringValue(record.created_at),
    updated_at: toStringValue(record.updated_at),
    batch_code: toStringValue(record.batch_code),
    farm_name: toStringValue(record.farm_name),
    pond_name: toStringValue(record.pond_name),
    harvest_date: toStringValue(record.harvest_date),
  }
}

function toFormData(payload: ProductMutationInput) {
  const formData = new FormData()

  formData.append('name', payload.name)
  formData.append('description', payload.description)
  formData.append('price', String(payload.price))
  formData.append('stock', String(payload.stock))
  formData.append('category', payload.category)
  formData.append('weight', String(payload.weight))
  formData.append('status', payload.status)

  if (payload.image_url?.trim()) {
    formData.append('image_url', payload.image_url.trim())
  }

  if (payload.image) {
    formData.append('image', payload.image)
  }

  return formData
}

class ProductService {
  async getProducts(params: ProductListParams = {}): Promise<ProductListResult> {
    const { data } = await api.get<ProductListEnvelope>('/products', {
      params: {
        page: params.page ?? DEFAULT_PAGE,
        limit: params.limit ?? DEFAULT_LIMIT,
        search: params.search || undefined,
        category: params.category || undefined,
        status: params.status || undefined,
      },
    })

    const items = Array.isArray(data.data?.items) ? data.data.items : []

    return {
      items: items.map((item, index) => mapProduct(item, index + 1)),
      meta: {
        page: toNumber(data.data?.meta?.page, params.page ?? DEFAULT_PAGE),
        limit: toNumber(data.data?.meta?.limit, params.limit ?? DEFAULT_LIMIT),
        total: toNumber(data.data?.meta?.total, items.length),
      },
    }
  }

  async getProduct(id: number): Promise<Product> {
    const { data } = await api.get<ProductDetailEnvelope>(`/products/${id}`)

    if (!data.data) {
      throw new Error('Product not found')
    }

    return mapProduct(data.data, id)
  }

  async createProduct(payload: ProductMutationInput): Promise<Product> {
    const { data } = await api.post<ApiResponse<ProductApiRecord>>(
      '/admin/products',
      toFormData(payload),
    )

    return mapProduct(data.data)
  }

  async updateProduct(id: number, payload: ProductMutationInput): Promise<Product> {
    const { data } = await api.put<ApiResponse<ProductApiRecord>>(
      `/admin/products/${id}`,
      toFormData(payload),
    )

    return mapProduct(data.data, id)
  }

  async deleteProduct(id: number) {
    const { data } = await api.delete<ApiResponse<null>>(`/admin/products/${id}`)
    return data
  }
}

export const productService = new ProductService()
