import { MapPinHouse, PencilLine } from 'lucide-react'

type AddressCardProps = {
  address: string
  onEditAddress: () => void
}

export function AddressCard({ address, onEditAddress }: AddressCardProps) {
  return (
    <section className="profile-card rounded-xl border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Alamat Pengiriman
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Alamat Default</h2>
        </div>

        <button
          type="button"
          onClick={onEditAddress}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <PencilLine className="size-4" />
          Edit Alamat
        </button>
      </div>

      <div className="profile-subcard mt-6 rounded-xl border border-slate-100 bg-gradient-to-br from-emerald-50 to-white p-5">
        <div className="flex items-start gap-3">
          <div className="profile-subcard rounded-2xl border border-slate-100 bg-white p-2.5">
            <MapPinHouse className="size-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Alamat Pengiriman Utama</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{address || '-'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
