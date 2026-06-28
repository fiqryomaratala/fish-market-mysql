import { useMemo, useState } from 'react'
import { AlertCircle, Heart, ShoppingCart, Wallet } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ActionButton } from '@/components/product-detail/ActionButton'
import { LoadingSkeleton } from '@/components/product-detail/LoadingSkeleton'
import { ProductGallery } from '@/components/product-detail/ProductGallery'
import { ProductInfo } from '@/components/product-detail/ProductInfo'
import { ProductTabs } from '@/components/product-detail/ProductTabs'
import { QuantitySelector } from '@/components/product-detail/QuantitySelector'
import { RelatedProducts } from '@/components/product-detail/RelatedProducts'
import { TrackingCard } from '@/components/product-detail/TrackingCard'
import { useAuth } from '@/hooks/useAuth'
import { useAddCart } from '@/hooks/useCart'
import { useProduct } from '@/hooks/useProduct'
import { useProducts } from '@/hooks/useProducts'
import { FALLBACK_PLACEHOLDER_IMAGE } from '@/services/product.service'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatDate(value: string) {
  if (!value) {
    return '-'
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return dateFormatter.format(parsed)
}

function buildGalleryImages(imageUrl: string) {
  if (!imageUrl) {
    return [FALLBACK_PLACEHOLDER_IMAGE]
  }

  if (imageUrl.includes('unsplash.com')) {
    return [
      `${imageUrl}&sat=-10`,
      `${imageUrl}&sat=15`,
      `${imageUrl}&exp=5`,
      `${imageUrl}&con=10`,
    ]
  }

  return [imageUrl, imageUrl, imageUrl, imageUrl]
}

function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const addCartMutation = useAddCart()
  const { data, isLoading, error, refetch } = useProduct(id)
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useProducts()
  const product = data

  const relatedProducts = useMemo(() => {
    const items = products?.items ?? []

    return items.filter((item) => item.id !== product?.id).slice(0, 4)
  }, [product?.id, products?.items])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-red-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/70">
        <div className="rounded-full bg-red-50 p-4 text-red-500">
          <AlertCircle className="size-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-slate-900">Gagal memuat detail produk</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          {error instanceof Error
            ? error.message
            : 'Data produk belum berhasil diambil dari server. Coba muat ulang untuk mengambil detail terbaru dari endpoint produk.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
        >
          Retry
        </button>
      </section>
    )
  }

  if (!product) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-lg shadow-slate-200/70">
        <h1 className="text-3xl font-semibold text-slate-900">Produk tidak ditemukan</h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
          Detail produk untuk ID ini belum tersedia atau sudah tidak aktif di marketplace.
        </p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          Kembali ke Marketplace
        </button>
      </section>
    )
  }

  const galleryImages = buildGalleryImages(product.image_url)
  const currentQuantity = product.stock <= 0 ? 0 : Math.min(Math.max(quantity, 1), product.stock)
  const formattedPrice = currencyFormatter.format(product.price)
  const formattedHarvestDate = formatDate(product.harvest_date)
  const categoryLabel = product.category || '-'
  const addToCartError =
    addCartMutation.error instanceof Error ? addCartMutation.error.message : ''
  const statusToneClassName =
    product.status === 'Fresh Harvest'
      ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
      : product.status === 'Ready Stock'
        ? 'border border-blue-200 bg-blue-50 text-blue-700'
        : product.status === 'Upcoming Harvest'
          ? 'border border-amber-200 bg-amber-50 text-amber-700'
          : 'border border-slate-200 bg-slate-50 text-slate-700'

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eff6ff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
          Marketplace Detail
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-5xl">
          Detail panen premium dengan informasi batch yang transparan.
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
          Pelajari spesifikasi produk, asal budidaya, status panen, dan jalur tracking batch dalam
          satu tampilan yang ringkas namun informatif.
        </p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <ProductGallery key={product.id} name={product.name} images={galleryImages} />

        <div className="space-y-5">
          <ProductInfo
            product={product}
            formattedPrice={formattedPrice}
            categoryLabel={categoryLabel}
            stockLabel={product.stock > 0 ? `${product.stock} tersedia` : 'Stok habis'}
            statusToneClassName={statusToneClassName}
          />

          <QuantitySelector
            quantity={currentQuantity}
            stock={product.stock}
            onDecrease={() => setQuantity((current) => Math.max(1, current - 1))}
            onIncrease={() =>
              setQuantity((current) => Math.min(product.stock, Math.max(1, current + 1)))
            }
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <ActionButton
              label={addCartMutation.isPending ? 'Adding...' : 'Add To Cart'}
              icon={<ShoppingCart className="size-4" />}
              onClick={async () => {
                try {
                  await addCartMutation.mutateAsync({
                    product_id: product.id,
                    quantity: currentQuantity,
                  })
                  toast.success(
                    isAuthenticated
                      ? 'Produk ditambahkan ke keranjang'
                      : 'Produk ditambahkan ke keranjang sementara',
                  )
                } catch (mutationError) {
                  toast.error(
                    mutationError instanceof Error
                      ? mutationError.message
                      : 'Failed to add product to cart',
                  )
                }
              }}
              disabled={product.stock <= 0}
              className={
                product.stock <= 0 || addCartMutation.isPending
                  ? 'cursor-not-allowed opacity-50 hover:translate-y-0'
                  : ''
              }
            />
            <ActionButton
              label="Buy Now"
              icon={<Wallet className="size-4" />}
              variant="secondary"
              onClick={() => navigate('/checkout')}
              disabled={product.stock <= 0}
              className={product.stock <= 0 ? 'cursor-not-allowed opacity-50 hover:translate-y-0' : ''}
            />
            <ActionButton
              label="Wishlist"
              icon={<Heart className="size-4" />}
              variant="ghost"
            />
          </div>

          {addToCartError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {addToCartError}
            </p>
          ) : null}
        </div>
      </section>

      <section className="w-full">
        <ProductTabs product={product} formattedHarvestDate={formattedHarvestDate} />
      </section>

      <TrackingCard batchCode={product.batch_code} />

      {isLoadingProducts ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70"
            />
          ))}
        </div>
      ) : null}

      {!isLoadingProducts && !productsError ? (
        <RelatedProducts products={relatedProducts} />
      ) : null}
    </div>
  )
}

export default ProductDetailPage
