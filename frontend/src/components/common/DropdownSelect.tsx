import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type DropdownOption = {
  label: string
  value: string
}

type DropdownSelectProps = {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
}

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function DropdownSelect({
  value,
  options,
  onChange,
  placeholder = 'Pilih opsi',
  ariaLabel,
  disabled = false,
  className,
}: DropdownSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const menuIsOpen = isOpen && !disabled
  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  useEffect(() => {
    if (!menuIsOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [menuIsOpen])

  return (
    <div ref={dropdownRef} className={joinClassNames('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={menuIsOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((current) => !current)}
        className={joinClassNames(
          'flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm outline-none transition',
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
            : menuIsOpen
              ? 'border-cyan-400 bg-cyan-50/50 ring-4 ring-cyan-100'
              : 'border-slate-200 bg-white text-slate-700 hover:border-cyan-200',
        )}
      >
        <span
          className={joinClassNames(
            'truncate font-medium',
            selectedOption ? 'text-slate-700' : 'text-slate-400',
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          className={joinClassNames(
            'size-4 shrink-0 text-slate-400 transition-transform',
            menuIsOpen && 'rotate-180',
          )}
        />
      </button>

      {menuIsOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-20 rounded-[1.6rem] border border-slate-200/90 bg-white p-3 shadow-[0_20px_45px_rgba(148,163,184,0.28)]">
          <div role="listbox" aria-label={ariaLabel} className="grid gap-2">
            {options.map((option) => {
              const isActive = option.value === value

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={joinClassNames(
                    'w-full rounded-[1.15rem] px-5 py-4 text-left text-[15px] transition',
                    isActive
                      ? 'bg-slate-100 font-medium text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
