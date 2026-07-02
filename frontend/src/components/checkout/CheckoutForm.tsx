import { AlertCircle, FileText } from 'lucide-react'
import { FormProvider, type UseFormReturn } from 'react-hook-form'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { PaymentMethod } from '@/components/checkout/PaymentMethod'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { CHECKOUT_SHIPPING_FEE, type CheckoutFormValues } from '@/types/checkout'
import type { CartSummary } from '@/types/cart'

type CheckoutFormProps = {
  cart: CartSummary
  form: UseFormReturn<CheckoutFormValues>
  isSubmitting: boolean
  isRefreshingCart: boolean
  isOnlinePaymentUnavailable: boolean
  submitError?: string | null
  onSubmit: (values: CheckoutFormValues) => void | Promise<void>
  onRetry: () => void
}

export function CheckoutForm({
  cart,
  form,
  isSubmitting,
  isRefreshingCart,
  isOnlinePaymentUnavailable,
  submitError,
  onSubmit,
  onRetry,
}: CheckoutFormProps) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 xl:items-start xl:grid-cols-[minmax(0,1fr)_380px]"
      >
        <div className="space-y-6">
          <ShippingForm />
          <PaymentMethod isOnlinePaymentUnavailable={isOnlinePaymentUnavailable} />

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <FileText className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
                  Notes
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Catatan Tambahan</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Tambahkan instruksi singkat untuk penjual bila diperlukan.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <label htmlFor="notes" className="text-sm font-semibold text-slate-700">
                Catatan untuk penjual
              </label>
              <textarea
                id="notes"
                rows={5}
                placeholder="Contoh: mohon hubungi sebelum pengiriman."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
                {...form.register('notes')}
              />
            </div>

            {Object.keys(form.formState.errors).length > 0 ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>Lengkapi field wajib sebelum melanjutkan checkout.</span>
              </div>
            ) : null}
          </section>
        </div>

        <OrderSummary
          items={cart.items}
          totalItems={cart.total_items}
          subtotal={cart.total_price}
          shippingFee={CHECKOUT_SHIPPING_FEE}
          isSubmitting={isSubmitting}
          isRefreshing={isRefreshingCart}
          isOnlinePaymentUnavailable={isOnlinePaymentUnavailable}
          submitError={submitError}
          onRetry={onRetry}
        />
      </form>
    </FormProvider>
  )
}
