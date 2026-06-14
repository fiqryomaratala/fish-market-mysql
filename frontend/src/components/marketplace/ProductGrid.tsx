import { EmptyState } from '@/components/marketplace/EmptyState'
import { ProductCard } from '@/components/marketplace/ProductCard'
import type { Product } from '@/types/product'

type ProductGridProps = {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
