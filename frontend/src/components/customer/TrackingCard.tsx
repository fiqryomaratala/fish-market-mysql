import { Fish, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function TrackingCard() {
  const [batchCode, setBatchCode] = useState('')
  const navigate = useNavigate()

  return (
    <section
      id="tracking-batch"
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
          <Fish className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Fish Batch Tracking
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Lacak Batch Ikan</h2>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Masukkan kode batch untuk membuka halaman tracking produk budidaya Anda.
          </p>
        </div>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          const normalized = batchCode.trim()

          if (!normalized) {
            return
          }

          navigate(`/tracking/${normalized}`)
        }}
      >
        <label className="block text-sm text-slate-600">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Batch Code
          </span>
          <input
            type="text"
            value={batchCode}
            onChange={(event) => setBatchCode(event.target.value)}
            placeholder="Contoh: BTCH-2026-0001"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-emerald-600"
        >
          <Search className="size-4" />
          Track
        </button>
      </form>
    </section>
  )
}
