import { getProductStatusClasses, getProductStatusLabel } from './product-status'

type ProductStatusBadgeProps = {
  status: string
  className?: string
}

export function ProductStatusBadge({
  status,
  className = '',
}: ProductStatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getProductStatusClasses(status)} ${className}`}
    >
      {getProductStatusLabel(status)}
    </span>
  )
}
