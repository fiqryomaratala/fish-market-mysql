import { Download, FileSpreadsheet } from 'lucide-react'

type ExportSectionProps = {
  canExport: boolean
  helperText: string
  isExportingPdf?: boolean
  isExportingExcel?: boolean
  onExportPdf: () => void
  onExportExcel: () => void
}

export function ExportSection({
  canExport,
  helperText,
  isExportingPdf = false,
  isExportingExcel = false,
  onExportPdf,
  onExportExcel,
}: ExportSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-600">
            Export Section
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Unduh laporan</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">{helperText}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onExportPdf}
            disabled={!canExport || isExportingPdf}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="size-4" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            disabled={!canExport || isExportingExcel}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileSpreadsheet className="size-4" />
            Export Excel
          </button>
        </div>
      </div>
    </section>
  )
}
