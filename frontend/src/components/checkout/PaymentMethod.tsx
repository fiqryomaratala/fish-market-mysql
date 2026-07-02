import { Landmark, Truck, Wallet } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { paymentMethodOptions, type CheckoutFormValues } from '@/types/checkout'

const paymentIcons = {
  bank_transfer: Landmark,
  e_wallet: Wallet,
  cod: Truck,
} as const

type PaymentMethodProps = {
  isOnlinePaymentUnavailable?: boolean
}

export function PaymentMethod({ isOnlinePaymentUnavailable = false }: PaymentMethodProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>()

  const selectedMethod = watch('payment_method')

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
        Payment Method
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Pilih Pembayaran</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Pembayaran online akan diarahkan ke checkout Xendit, sedangkan COD diproses manual saat pesanan diterima.
      </p>

      {isOnlinePaymentUnavailable ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Pembayaran online sedang tidak tersedia.</p>
          <p className="mt-1 leading-6">
            Anda bisa mencoba lagi nanti, atau pindah ke COD agar checkout tetap bisa dilanjutkan sekarang.
          </p>
          {selectedMethod !== 'cod' ? (
            <button
              type="button"
              onClick={() => {
                setValue('payment_method', 'cod', {
                  shouldDirty: true,
                  shouldTouch: true,
                  shouldValidate: true,
                })
              }}
              className="mt-3 inline-flex rounded-xl border border-amber-200 bg-white px-4 py-2 font-semibold text-amber-700 transition hover:bg-amber-100"
            >
              Ganti ke COD
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4">
        {paymentMethodOptions.map((option) => {
          const Icon = paymentIcons[option.value]
          const isSelected = selectedMethod === option.value

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-4 shadow-sm transition-all duration-200 ease-in-out hover:shadow-[0_8px_20px_rgba(15,23,42,0.05)] ${
                isSelected
                  ? 'border-blue-200 bg-blue-50/70 shadow-[0_10px_24px_rgba(59,130,246,0.10)]'
                  : 'border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                className="sr-only"
                {...register('payment_method')}
              />
              <span
                aria-hidden="true"
                className={`mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border bg-white transition-all duration-200 ease-in-out ${
                  isSelected ? 'border-blue-500' : 'border-slate-300'
                }`}
              >
                <span
                  className={`size-2.5 rounded-full bg-blue-500 transition-all duration-200 ease-in-out ${
                    isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
              </span>
              <div className="rounded-xl bg-white p-3 text-blue-600 shadow-sm">
                <Icon className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                <p className="text-sm leading-6 text-slate-500">{option.description}</p>
              </div>
            </label>
          )
        })}
      </div>

      {errors.payment_method?.message ? (
        <p className="mt-3 text-sm text-rose-500">{errors.payment_method.message}</p>
      ) : null}
    </section>
  )
}
