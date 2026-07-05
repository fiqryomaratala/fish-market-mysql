import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { createPortal } from 'react-dom'

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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const menuIsOpen = isOpen && !disabled
  const [menuStyle, setMenuStyle] = useState<{
    top: number
    left: number
    width: number
  }>({
    top: 0,
    left: 0,
    width: 0,
  })
  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const selectedOption = normalizedOptions.find((option) => option.value === value)
  const displayValue = selectedOption?.label ?? placeholder
  const widthClass = widthClasses[width]

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      const clickedTrigger = containerRef.current?.contains(target)
      const clickedMenu = menuRef.current?.contains(target)

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  useLayoutEffect(() => {
    if (!menuIsOpen || !triggerRef.current) {
      return
    }

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect()

      if (!rect) {
        return
      }

      const width = rect.width
      const top = rect.bottom + 8
      const left = align === 'right' ? rect.right - width : rect.left

      setMenuStyle({ top, left, width })
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [align, menuIsOpen])

  return (
    <div
      ref={containerRef}
      className={`relative z-20 flex flex-col gap-2 text-sm text-slate-600 ${widthClass}`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={menuIsOpen}
        className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border bg-white px-5 py-3.5 text-left text-sm shadow-sm transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none ${
          disabled
            ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
            : 'text-slate-800'
        } ${
          menuIsOpen
            ? 'border-blue-200 ring-4 ring-blue-100'
            : 'border-slate-200 hover:border-blue-200'
        }`}
        >
        <span className={`truncate ${value ? 'text-slate-800' : 'text-slate-400'}`}>
          {displayValue}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-slate-500 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuIsOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {menuIsOpen
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                top: menuStyle.top,
                left: menuStyle.left,
                width: menuStyle.width,
                zIndex: 1000,
              }}
              className="origin-top rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/80"
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
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
