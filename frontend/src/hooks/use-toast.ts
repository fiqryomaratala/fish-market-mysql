import { useState } from 'react'

type ToastType = 'default' | 'destructive' | 'success'

type Toast = {
  id: string
  title?: string
  description: string
  variant?: ToastType
  duration?: number
}

type ToastOptions = {
  title?: string
  description: string
  variant?: ToastType
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (options: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      title: options.title,
      description: options.description,
      variant: options.variant || 'default',
      duration: options.duration || 5000
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    if ((newToast.duration ?? 0) > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, newToast.duration ?? 0)
    }

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const dismissAll = () => {
    setToasts([])
  }

  return {
    toasts,
    toast,
    dismiss,
    dismissAll
  }
}
