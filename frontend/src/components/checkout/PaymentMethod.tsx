import { Landmark, Truck, Wallet } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { paymentMethodOptions, type CheckoutFormValues } from '@/types/checkout'

const paymentIcons = {
  bank_transfer: Landmark,
  e_wallet: Wallet,
  cod: Truck,
} as const

export function PaymentMethod() {
  const {
    register,
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
        Opsi pembayaran ini masih dummy dan mudah ditambah saat integrasi payment gateway dilakukan.
      </p>

      <div className="mt-6 grid gap-4">
        {paymentMethodOptions.map((option) => {
          const Icon = paymentIcons[option.value]
          const isSelected = selectedMethod === option.value

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border px-4 py-4 shadow-sm transition ${
                isSelected
                  ? 'border-blue-200 bg-blue-50/70 shadow-blue-100'
                  : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                className="mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                {...register('payment_method')}
              />
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
