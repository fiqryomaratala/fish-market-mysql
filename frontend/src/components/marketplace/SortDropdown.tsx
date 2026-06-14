import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type DropdownWidth = 'full' | 'sm' | 'md' | 'lg'
type DropdownAlign = 'left' | 'right'
type DropdownOption = {
  label: string
  value: string
}

type SortDropdownProps = {
  value?: string
  options: Array<string | DropdownOption>
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  width?: DropdownWidth
  align?: DropdownAlign
  disabled?: boolean
}

const widthClasses: Record<DropdownWidth, string> = {
  full: 'w-full',
  sm: 'w-full sm:w-48',
  md: 'w-full sm:w-56',
  lg: 'w-full sm:w-64',
}

export function SortDropdown({
  value,
  options,
  onChange,
  label = 'Urutkan',
  placeholder = 'Pilih opsi',
  width = 'full',
  align = 'left',
  disabled = false,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const selectedOption = normalizedOptions.find((option) => option.value === value)
  const displayValue = selectedOption?.label ?? placeholder
  const widthClass = widthClasses[width]
  const menuAlignClass = align === 'right' ? 'right-0' : 'left-0'

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      return
    }

    const timeout = window.setTimeout(() => {
      setIsVisible(false)
    }, 200)

    return () => window.clearTimeout(timeout)
  }, [isOpen])

  useEffect(() => {
    if (disabled) {
      setIsOpen(false)
    }
  }, [disabled])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col gap-2 text-sm text-slate-600 ${widthClass}`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-3.5 text-left text-sm shadow-sm transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
            : 'text-slate-800'
        } ${
          isOpen
            ? 'border-blue-200 ring-4 ring-blue-100'
            : 'border-slate-200 hover:border-blue-200'
        }`}
      >
        <span className={`truncate ${value ? 'text-slate-800' : 'text-slate-400'}`}>
          {displayValue}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isVisible ? (
        <div
          className={`absolute top-full z-30 mt-2 ${menuAlignClass} w-full origin-top rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/80 transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          }`}
        >
          <div role="listbox" aria-label={label} className="grid gap-1">
            {normalizedOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`rounded-xl px-4 py-3 text-left text-sm transition duration-150 ${
                  option.value === value
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
