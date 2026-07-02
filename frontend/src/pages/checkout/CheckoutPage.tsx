import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, LoaderCircle, RefreshCcw, ShoppingBag } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { useAuth } from '@/hooks/useAuth'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useCheckout'
import { checkoutSchema, type CheckoutFormValues } from '@/types/checkout'

type CheckoutErrorState = {
  isOnlinePaymentUnavailable: boolean
  message: string
}

function getCheckoutErrorState(error: unknown): CheckoutErrorState {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    const response = error.response as {
      status?: number
      data: { message: string }
    }
    const message = response.data.message
    const normalizedMessage = message.trim().toLowerCase()
    const isOnlinePaymentUnavailable =
      response.status === 503 || normalizedMessage.includes('online payment is currently unavailable')

    if (isOnlinePaymentUnavailable) {
      return {
        isOnlinePaymentUnavailable: true,
        message:
          'Pembayaran online sedang tidak tersedia. Anda bisa mencoba lagi beberapa saat lagi atau beralih ke COD agar pesanan tetap bisa diproses.',
      }
    }

    return {
      isOnlinePaymentUnavailable: false,
      message,
    }
  }

  if (error instanceof Error) {
    return {
      isOnlinePaymentUnavailable: false,
      message: error.message,
    }
  }

  return {
    isOnlinePaymentUnavailable: false,
    message: 'Terjadi kesalahan saat memproses checkout.',
  }
}

function CheckoutLoadingState() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-slate-200 bg-white px-6 py-12 text-center shadow-xl shadow-slate-200/70">
      <div className="rounded-full bg-blue-50 p-5 text-blue-600">
        <LoaderCircle className="size-8 animate-spin" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Memuat checkout</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
        Kami sedang mengambil cart terbaru dan menyiapkan form checkout Anda.
      </p>
    </section>
  )
}

function CheckoutErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] border border-rose-200 bg-white px-6 py-12 text-center shadow-xl shadow-rose-100/70">
      <div className="rounded-full bg-rose-50 p-5 text-rose-500">
        <AlertTriangle className="size-8" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-slate-900">Checkout belum bisa dimuat</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600"
      >
        <RefreshCcw className="size-4" />
        Retry
      </button>
    </section>
  )
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { user, role, isAuthenticated, loading: authLoading } = useAuth()
  const { data: cart, isLoading, error, refetch, isFetching } = useCart()
  const checkoutMutation = useCheckout()
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping_name: user?.name ?? '',
      phone: '',
      address: '',
      city: '',
      postal_code: '',
      notes: '',
      payment_method: 'bank_transfer',
    },
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: {
          from: {
            pathname: '/checkout',
          },
        },
      })
    }
  }, [authLoading, isAuthenticated, navigate])

  useEffect(() => {
    if (!authLoading && isAuthenticated && role !== 'customer') {
      toast.info('Checkout hanya tersedia untuk akun customer')
      navigate('/cart', { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate, role])

  useEffect(() => {
    if (!isLoading && cart && cart.items.length === 0) {
      navigate('/cart', { replace: true })
    }
  }, [cart, isLoading, navigate])

  useEffect(() => {
    if (user?.name) {
      form.setValue('shipping_name', user.name, {
        shouldDirty: false,
      })
    }
  }, [form, user?.name])

  const submitErrorState = checkoutMutation.error ? getCheckoutErrorState(checkoutMutation.error) : null
  const submitError = submitErrorState?.message ?? null

  const handleRetrySubmit = () => {
    checkoutMutation.reset()
  }

  const handleSubmit = async (values: CheckoutFormValues) => {
    try {
      const result = await checkoutMutation.mutateAsync(values)
      toast.success(`Order ${result.invoice_number} berhasil dibuat.`)

      if (result.payment_method !== 'cod' && result.payment_url) {
        window.location.assign(result.payment_url)
        return
      }

      navigate(`/orders/success/${result.order_id}`, {
        replace: true,
      })
    } catch (checkoutError) {
      toast.error(getCheckoutErrorState(checkoutError).message)
    }
  }

  if (authLoading || isLoading) {
    return <CheckoutLoadingState />
  }

  if (!isAuthenticated) {
    return null
  }

  if (role !== 'customer') {
    return null
  }

  if (error) {
    return (
      <CheckoutErrorState
        message={getCheckoutErrorState(error).message}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!cart || cart.items.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.10),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eff6ff_100%)] p-6 shadow-2xl shadow-slate-200/70 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">Checkout</p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-5xl">
              Finalisasi pengiriman dan selesaikan pesanan Anda.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
              Semua item di bawah diambil dari cart backend aktif, lalu dikirim ke endpoint checkout menggunakan TanStack Query dan Axios service.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-lg shadow-slate-200/60">
            <ShoppingBag className="size-4 text-blue-600" />
            <span>{cart.total_items} item siap diproses</span>
          </div>
        </div>
      </section>

      <CheckoutForm
        cart={cart}
        form={form}
        isSubmitting={checkoutMutation.isPending}
        isRefreshingCart={isFetching}
        isOnlinePaymentUnavailable={submitErrorState?.isOnlinePaymentUnavailable ?? false}
        submitError={submitError}
        onSubmit={handleSubmit}
        onRetry={handleRetrySubmit}
      />
    </div>
  )
}

export default CheckoutPage
