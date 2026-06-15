import { ArrowRight, LoaderCircle } from 'lucide-react'

type CheckoutButtonProps = {
  disabled: boolean
  isLoading: boolean
}

export function CheckoutButton({ disabled, isLoading }: CheckoutButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-300 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          <span>Memproses Order...</span>
        </>
      ) : (
        <>
          <span>Place Order</span>
          <ArrowRight className="size-4" />
        </>
      )}
    </button>
  )
}
