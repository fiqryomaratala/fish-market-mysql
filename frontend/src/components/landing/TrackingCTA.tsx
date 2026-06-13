import { SearchCheck } from 'lucide-react'
import { useState } from 'react'

export function TrackingCTA() {
  const [batchCode, setBatchCode] = useState('')

  return (
    <section id="tracking" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-600 to-green-600 p-8 shadow-lg shadow-blue-200 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-white uppercase">
              CTA Pelacakan Batch
            </span>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Lacak Batch Ikan Anda
            </h2>
            <p className="text-base leading-8 text-blue-50">
              Masukkan kode batch untuk mensimulasikan pengalaman traceability
              dari kolam, pakan, panen, hingga status distribusi.
            </p>
          </div>

          <form
            className="rounded-[1.75rem] border border-white/25 bg-white/95 p-5 shadow-lg shadow-blue-900/10"
            onSubmit={(event) => event.preventDefault()}
          >
            <label
              htmlFor="batch-code"
              className="mb-3 block text-sm font-medium text-slate-700"
            >
              Kode Batch
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="batch-code"
                type="text"
                value={batchCode}
                onChange={(event) => setBatchCode(event.target.value)}
                placeholder="Contoh: FM-2406-NILA"
                className="min-h-12 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white"
              />
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:scale-[1.02] hover:bg-blue-700"
              >
                <SearchCheck className="h-4 w-4" />
                Lacak
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
