import { ChevronLeft, ChevronRight } from 'lucide-react'

type OrderPaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function buildPages(currentPage: number, totalPages: number) {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (currentPage <= 2) {
    return [1, 2, 3]
  }

  if (currentPage >= totalPages - 1) {
    return [totalPages - 2, totalPages - 1, totalPages]
  }

  return [currentPage - 1, currentPage, currentPage + 1]
}

export function OrderPagination({
  currentPage,
  totalPages,
  onPageChange,
}: OrderPaginationProps) {
  const pages = buildPages(currentPage, totalPages)

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          className={`inline-flex size-11 items-center justify-center rounded-xl border text-sm font-semibold transition ${
            page === currentPage
              ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
