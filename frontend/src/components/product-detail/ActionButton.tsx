import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variantClassNames = {
  primary:
    'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5 hover:bg-blue-700',
  secondary:
    'border border-slate-200 bg-slate-900 text-white shadow-lg shadow-slate-200 hover:-translate-y-0.5 hover:bg-slate-800',
  ghost:
    'border border-slate-200 bg-white text-slate-700 shadow-lg shadow-slate-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600',
} as const

export function ActionButton({
  icon,
  label,
  variant = 'primary',
  className = '',
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${variantClassNames[variant]} ${className}`}
      {...props}
    >
      {icon}
      {label}
    </button>
  )
}
