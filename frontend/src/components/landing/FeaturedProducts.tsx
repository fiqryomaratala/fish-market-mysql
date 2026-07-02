import { Package } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/marketplace/ProductCard'

const PRIORITY_CATEGORIES = ['Gurame', 'Bandeng']

export function FeaturedProducts() {
  const productsQuery = useProducts({ page: 1, limit: 12, status: 'available' })
  const featuredProducts = [...(productsQuery.data?.items ?? [])]
    .sort((leftProduct, rightProduct) => {
      const leftPriority = PRIORITY_CATEGORIES.includes(leftProduct.category) ? 0 : 1
      const rightPriority = PRIORITY_CATEGORIES.includes(rightProduct.category) ? 0 : 1

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority
      }

      return rightProduct.stock - leftProduct.stock
    })
    .slice(0, 4)

  return (
    <section id="marketplace" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-lg border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-blue-700 uppercase">
              Produk Unggulan
            </span>
            <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
              Hasil panen air tawar pilihan yang siap untuk pesanan hari ini
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
            <Package className="h-4 w-4 text-green-600" />
            Stok diperbarui dari batch panen aktif
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {productsQuery.isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`featured-product-skeleton-${index}`}
                  className="h-[22rem] rounded-xl border border-slate-200 bg-white shadow-sm"
                />
              ))
            : featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        {!productsQuery.isLoading && featuredProducts.length === 0 ? (
          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Produk unggulan belum tersedia saat ini.
          </div>
        ) : null}
      </div>
    </section>
  )
}
