import { MapPin, Phone, UserRound } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import type { CheckoutFormValues } from '@/types/checkout'

type FieldProps = {
  name: keyof CheckoutFormValues
  label: string
  placeholder: string
  icon: React.ComponentType<{ className?: string }>
}

function TextField({ name, label, placeholder, icon: Icon }: FieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>()

  const errorMessage = errors[name]?.message

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100">
        <Icon className="size-4 text-blue-500" />
        <input
          id={name}
          type="text"
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          {...register(name)}
        />
      </div>
      {errorMessage ? <p className="text-sm text-rose-500">{errorMessage}</p> : null}
    </div>
  )
}

export function ShippingForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormValues>()

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/60">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <MapPin className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Shipping Form
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Alamat Pengiriman</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Isi data penerima agar backend dapat membentuk order dan alamat pengiriman dengan benar.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <TextField
          name="shipping_name"
          label="Nama Penerima"
          placeholder="Masukkan nama penerima"
          icon={UserRound}
        />
        <TextField
          name="phone"
          label="Nomor Telepon"
          placeholder="Contoh: 081234567890"
          icon={Phone}
        />
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-sm font-semibold text-slate-700">
            Alamat
          </label>
          <textarea
            id="address"
            rows={4}
            placeholder="Masukkan alamat lengkap pengiriman"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            {...register('address')}
          />
          {errors.address?.message ? (
            <p className="text-sm text-rose-500">{errors.address.message}</p>
          ) : null}
        </div>
        <TextField
          name="city"
          label="Kota"
          placeholder="Masukkan kota tujuan"
          icon={MapPin}
        />
        <TextField
          name="postal_code"
          label="Kode Pos"
          placeholder="Masukkan kode pos"
          icon={MapPin}
        />
      </div>
    </section>
  )
}
