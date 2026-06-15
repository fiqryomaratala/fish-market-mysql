import { Minus, Plus, RefreshCcw, ShoppingBag, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useCart, useClearCart, useDeleteCart, useUpdateCart } from '@/hooks/useCart'
import type { CartItem } from '@/types/cart'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

type QuantityControlProps = {
  item: CartItem
  disabled: boolean
  onChange: (item: CartItem, nextQuantity: number) => void
}

function QuantityControl({ item, disabled, onChange }: QuantityControlProps) {
  const isDecreaseDisabled = disabled || item.quantity <= 1
  const isIncreaseDisabled = disabled || item.quantity >= item.stock

  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange(item, item.quantity - 1)}
        disabled={isDecreaseDisabled}
        className="inline-flex size-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-12 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
      <button
        type="button"
        onClick={() => onChange(item, item.quantity + 1)}
        disabled={isIncreaseDisabled}
        className="inline-flex size-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-white hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
        <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-10 w-72 animate-pulse rounded-xl bg-slate-200" />
        <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded-full bg-slate-100" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60"
            />
          ))}
        </div>
        <div className="h-72 animate-pulse rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60" />
      </div>
    </div>
  )
}

function EmptyCartState() {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-xl shadow-slate-200/70">
      <div className="rounded-full bg-blue-50 p-5 text-blue-600">
        <ShoppingBag className="size-8" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Your cart is empty</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
        Belum ada produk yang ditambahkan ke keranjang. Jelajahi marketplace untuk memilih batch ikan terbaik sebelum checkout.
      </p>
      <Link
        to="/products"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        Continue Shopping
      </Link>
    </section>
  )
}

function CartErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <section className="flex min-h-[55vh] flex-col items-center justify-center rounded-[2rem] border border-red-200 bg-white px-6 py-12 text-center shadow-xl shadow-red-100/70">
      <div className="rounded-full bg-red-50 p-5 text-red-500">
        <RefreshCcw className="size-8" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Gagal memuat cart</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-600"
      >
        <RefreshCcw className="size-4" />
        Retry
      </button>
    </section>
  )
}

function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { data, isLoading, error, refetch, isFetching } = useCart()
  const updateCartMutation = useUpdateCart()
  const deleteCartMutation = useDeleteCart()
  const clearCartMutation = useClearCart()

  const items = data?.items ?? []
  const totalItems = data?.total_items ?? 0
  const totalPrice = data?.total_price ?? 0
  const isMutating =
    updateCartMutation.isPending || deleteCartMutation.isPending || clearCartMutation.isPending

  const handleQuantityChange = async (item: CartItem, nextQuantity: number) => {
    if (nextQuantity < 1 || nextQuantity > item.stock || nextQuantity === item.quantity) {
      return
    }

    const targetId = isAuthenticated ? item.id : item.product_id

    try {
      await updateCartMutation.mutateAsync({
        id: targetId,
        payload: { quantity: nextQuantity },
      })
      toast.success('Cart updated successfully')
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to update cart')
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteCartMutation.mutateAsync(itemId)
      toast.success('Item removed from cart')
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to remove item')
    }
  }

  const handleClearCart = async () => {
    try {
      await clearCartMutation.mutateAsync()
      toast.success('Cart cleared successfully')
    } catch (mutationError) {
      toast.error(mutationError instanceof Error ? mutationError.message : 'Failed to clear cart')
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Login diperlukan sebelum melanjutkan ke checkout')
      navigate('/login', {
        state: {
          from: {
            pathname: '/cart',
          },
        },
      })
      return
    }

    navigate('/checkout')
  }

  if (isLoading) {
    return <CartSkeleton />
  }

  if (error) {
    return (
      <CartErrorState
        message={error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat cart.'}
        onRetry={() => refetch()}
      />
    )
  }

  if (items.length === 0) {
    return <EmptyCartState />
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eff6ff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Cart</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">
              Review produk sebelum melanjutkan ke checkout.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
              Pantau kuantitas, subtotal, dan total harga dalam satu tampilan yang responsif untuk desktop maupun mobile.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5 hover:border-red-200 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            Clear Cart
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Quantity</th>
                    <th className="px-4 py-4">Subtotal</th>
                    <th className="px-6 py-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-slate-50/80">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="size-20 rounded-xl object-cover shadow-md shadow-slate-200"
                          />
                          <div className="space-y-1">
                            <p className="text-base font-semibold text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">Batch Code: {item.batch_code}</p>
                            <p className="text-sm text-slate-500">Farm Name: {item.farm_name}</p>
                            <p className="text-xs text-slate-400">Stock tersedia: {item.stock}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm font-semibold text-slate-700">
                        {currencyFormatter.format(item.price)}
                      </td>
                      <td className="px-4 py-5">
                        <QuantityControl
                          item={item}
                          disabled={isMutating}
                          onChange={handleQuantityChange}
                        />
                      </td>
                      <td className="px-4 py-5 text-sm font-semibold text-slate-900">
                        {currencyFormatter.format(item.subtotal)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteItem(isAuthenticated ? item.id : item.product_id)
                          }
                          disabled={isMutating}
                          className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-3 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 md:hidden">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 transition hover:-translate-y-0.5"
              >
                <div className="flex gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="size-24 rounded-xl object-cover shadow-md shadow-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">Batch Code: {item.batch_code}</p>
                    <p className="text-sm text-slate-500">Farm Name: {item.farm_name}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {currencyFormatter.format(item.price)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Quantity</p>
                    <div className="mt-2">
                      <QuantityControl
                        item={item}
                        disabled={isMutating}
                        onChange={handleQuantityChange}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(isAuthenticated ? item.id : item.product_id)}
                    disabled={isMutating}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-3 text-slate-500 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-500">Subtotal</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {currencyFormatter.format(item.subtotal)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="xl:sticky xl:top-28 xl:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
                  Summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order Summary</h2>
              </div>
              {isFetching ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Syncing
                </span>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Total Item</span>
                <span className="font-semibold text-slate-900">{totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Total Price</span>
                <span className="text-lg font-semibold text-slate-900">
                  {currencyFormatter.format(totalPrice)}
                </span>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Keranjang guest aktif. Login saat checkout untuk melanjutkan pesanan Anda.
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={items.length === 0 || isMutating}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthenticated ? 'Checkout' : 'Login untuk Checkout'}
            </button>

            <Link
              to="/products"
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CartPage
