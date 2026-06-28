import type { Product } from '@/types/product'
import { ProductRow } from './ProductRow'

type ProductTableProps = {
  products: Product[]
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="hidden grid-cols-[90px_1.8fr_1fr_1fr_0.8fr_0.9fr_1fr_120px] gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:grid">
        <span>Image</span>
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Status</span>
        <span>Created Date</span>
        <span>Action</span>
      </div>

      <div className="space-y-3 p-4 lg:space-y-0 lg:p-0">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
