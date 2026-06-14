import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type SortDropdownProps = {
  value: string
  options: string[]
  onChange: (value: string) => void
  label?: string
}

export function SortDropdown({
  value,
  options,
  onChange,
  label = 'Sort By',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

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
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <div ref={containerRef} className="relative flex flex-col gap-2 text-sm text-slate-600">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-3.5 text-left text-sm text-slate-800 shadow-sm transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none ${
          isOpen
            ? 'border-blue-200 ring-4 ring-blue-100'
            : 'border-slate-200 hover:border-blue-200'
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isVisible ? (
        <div
          className={`absolute top-full z-30 mt-2 w-full origin-top rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/80 transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen
              ? 'scale-100 opacity-100'
              : 'pointer-events-none scale-95 opacity-0'
          }`}
        >
          <div role="listbox" aria-label={label} className="grid gap-1">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option)
                  setIsOpen(false)
                }}
                className={`rounded-xl px-4 py-3 text-left text-sm transition duration-150 ${
                  option === value
                    ? 'bg-blue-50 font-semibold text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
