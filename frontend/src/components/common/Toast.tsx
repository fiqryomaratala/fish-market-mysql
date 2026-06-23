import { useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Toast() {
  const { toasts, dismiss } = useToast()

  useEffect(() => {
    // Cleanup toasts on unmount
    return () => {
      toasts.forEach((toast) => {
        if (toast.duration && toast.duration > 0) {
          setTimeout(() => dismiss(toast.id), toast.duration)
        }
      })
    }
  }, [toasts, dismiss])

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex max-h-screen w-full max-w-sm flex-col gap-2 overflow-y-auto p-4">
      {toasts.map((toast) => {
        const { id, title, description, variant } = toast

        const variantClasses = {
          default: 'bg-white border border-slate-200 text-slate-900',
          destructive: 'bg-red-50 border border-red-200 text-red-900',
          success: 'bg-emerald-50 border border-emerald-200 text-emerald-900'
        }

        const iconClasses = {
          default: 'bg-slate-100 text-slate-600',
          destructive: 'bg-red-100 text-red-600',
          success: 'bg-emerald-100 text-emerald-600'
        }

        const Icon = variant === 'destructive' 
          ? AlertTriangle 
          : variant === 'success' 
          ? CheckCircle 
          : variant === 'default' 
          ? Info 
          : AlertCircle

        return (
          <div
            key={id}
            className={`relative flex items-start gap-3 rounded-xl p-4 shadow-lg ${variantClasses[variant || 'default']}`}
          >
            <div className={`mt-0.5 rounded-lg p-2 ${iconClasses[variant || 'default']}`}>
              <Icon className="size-4" />
            </div>
            <div className="flex-1">
              {title && (
                <p className="text-sm font-semibold">
                  {title}
                </p>
              )}
              <p className={`mt-1 text-sm ${title ? 'text-slate-700' : ''}`}>
                {description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => dismiss(id)}
              className="mt-0.5 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}