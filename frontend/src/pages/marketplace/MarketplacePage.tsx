import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, SlidersHorizontal } from 'lucide-react'
import { FilterSidebar, type MarketplaceFilters } from '@/components/marketplace/FilterSidebar'
import { LoadingSkeleton } from '@/components/marketplace/LoadingSkeleton'
import { Pagination } from '@/components/marketplace/Pagination'
import { ProductGrid } from '@/components/marketplace/ProductGrid'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { SortDropdown } from '@/components/marketplace/SortDropdown'
import { useProducts } from '@/hooks/useProducts'
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from '@/types/product'

type MarketplaceCategory = 'All' | ProductCategory

const categoryOptions = [
  { label: 'Semua', value: 'All' },
  ...PRODUCT_CATEGORIES.map((category) => ({
    label: category,
    value: category,
  })),
] as const
const sortOptions = [
  { label: 'Terbaru', value: 'Newest' },
  { label: 'Harga Terendah', value: 'Lowest Price' },
  { label: 'Harga Tertinggi', value: 'Highest Price' },
  { label: 'Paling Laris', value: 'Best Selling' },
] as const
const initialFilters: MarketplaceFilters = {
  minPrice: '',
  maxPrice: '',
  availability: 'All',
  harvestStatus: 'All',
}

function resolveMarketplaceCategory(product: Product): ProductCategory | null {
  const rawCategory = product.category.trim().toLowerCase()

  const matchedCategory = PRODUCT_CATEGORIES.find(
    (category) => category.toLowerCase() === rawCategory,
  )

  if (matchedCategory) {
    return matchedCategory
  }

  return null
}

function MarketplacePage() {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<MarketplaceCategory>('All')
  const [selectedSort, setSelectedSort] = useState<(typeof sortOptions)[number]['value']>('Newest')
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim())
      setCurrentPage(1)
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const { data, isLoading, error, refetch } = useProducts()

  const filteredProducts = useMemo(() => {
    const items = data?.items ?? []

    return items
      .filter((product) => {
        const matchesSearch =
          debouncedSearch.length === 0 ||
          product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          product.batch_code.toLowerCase().includes(debouncedSearch.toLowerCase())
        const matchesAvailability = filters.availability === 'All'
          ? true
          : filters.availability === 'In Stock'
            ? product.stock > 0
            : product.stock <= 0
        const harvestStatus =
          product.status === 'Fresh Harvest' ||
          product.status === 'Ready Stock' ||
          product.status === 'Upcoming Harvest'
            ? product.status
            : product.stock > 0
              ? 'Ready Stock'
              : 'Upcoming Harvest'
        const matchesHarvestStatus =
          filters.harvestStatus === 'All' || harvestStatus === filters.harvestStatus
        const minPrice = filters.minPrice ? Number(filters.minPrice) : 0
        const maxPrice = filters.maxPrice ? Number(filters.maxPrice) : Number.POSITIVE_INFINITY
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice
        const normalizedCategory = resolveMarketplaceCategory(product)
        const matchesCategory =
          selectedCategory === 'All' || normalizedCategory === selectedCategory

        return (
          matchesSearch &&
          matchesAvailability &&
          matchesHarvestStatus &&
          matchesPrice &&
          matchesCategory
        )
      })
      .sort((left, right) => {
        if (selectedSort === 'Lowest Price') {
          return left.price - right.price
        }

        if (selectedSort === 'Highest Price') {
          return right.price - left.price
        }

        return (
          new Date(right.harvest_date).getTime() - new Date(left.harvest_date).getTime()
        )
      })
  }, [data?.items, debouncedSearch, filters, selectedCategory, selectedSort])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / 8))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * 8

    return filteredProducts.slice(startIndex, startIndex + 8)
  }, [filteredProducts, safeCurrentPage])

  const handleResetFilters = () => {
    setFilters(initialFilters)
    setSelectedCategory('All')
    setSelectedSort('Newest')
    setSearchInput('')
    setDebouncedSearch('')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(22,163,74,0.10),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eff6ff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
            Pasar Ikan
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-5xl">
            Hasil budidaya ikan segar langsung dari farm terbaik.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            Jelajahi stok panen air tawar dan laut dengan pengalaman marketplace yang cepat,
            bersih, dan nyaman dipakai di semua perangkat.
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <FilterSidebar
          filters={filters}
          isMobileOpen={isMobileFilterOpen}
          onChange={(nextFilters) => {
            setFilters(nextFilters)
            setCurrentPage(1)
          }}
          onReset={handleResetFilters}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 backdrop-blur md:p-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,0.7fr))]">
              <SearchBar value={searchInput} onChange={setSearchInput} />

              <SortDropdown
                label="Kategori"
                value={selectedCategory}
                options={[...categoryOptions]}
                placeholder="Semua"
                width="full"
                align="left"
                onChange={(value) => {
                  setSelectedCategory(value as MarketplaceCategory)
                  setCurrentPage(1)
                }}
              />

              <SortDropdown
                label="Urutkan"
                value={selectedSort}
                options={[...sortOptions]}
                placeholder="Terbaru"
                width="full"
                align="left"
                onChange={(value) => {
                  setSelectedSort(value as (typeof sortOptions)[number]['value'])
                  setCurrentPage(1)
                }}
              />

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 xl:hidden"
              >
                <SlidersHorizontal className="size-4" />
                Filter
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
              <p>
                Menampilkan{' '}
                <span className="font-semibold text-slate-900">{filteredProducts.length}</span>{' '}
                produk
              </p>
              <p>
                Pencarian real-time aktif untuk{' '}
                <span className="font-semibold text-blue-600">
                  {debouncedSearch || 'semua ikan'}
                </span>
              </p>
            </div>
          </div>

          {isLoading ? <LoadingSkeleton /> : null}

          {error ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-[2rem] border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/70">
              <div className="mb-5 rounded-full bg-red-50 p-4 text-red-500">
                <AlertCircle className="size-8" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">Gagal memuat produk</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-slate-500">
                {error instanceof Error
                  ? error.message
                  : 'Ada masalah saat mengambil data marketplace dari server. Silakan coba lagi.'}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-6 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Coba Lagi
              </button>
            </div>
          ) : null}

          {!isLoading && !error ? (
            <>
              <ProductGrid products={paginatedProducts as Product[]} />
              <Pagination
                currentPage={safeCurrentPage}
                totalPages={Math.min(totalPages, 3)}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}

export default MarketplacePage
