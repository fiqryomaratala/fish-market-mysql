import { Check } from 'lucide-react'
import type { OrderStatus } from '@/types/order-management'

interface OrderTimelineProps {
  currentStatus: string
}

const timelineSteps: OrderStatus[] = [
  'Pending',
  'Paid',
  'Processing',
  'Shipping',
  'Completed',
]

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = timelineSteps.indexOf(currentStatus as OrderStatus)
  const isCancelled = currentStatus === 'Cancelled'

  if (isCancelled) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-center">
        <p className="text-sm font-semibold text-red-700">Pesanan Dibatalkan</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={step} className="flex flex-1 flex-col items-center">
              <div className="relative flex w-full items-center">
                {index !== 0 && (
                  <div
                    className={`h-1 w-full ${
                      isCompleted ? 'bg-blue-500' : 'bg-slate-200'
                    }`}
                  />
                )}
                <div
                  className={`z-10 flex size-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 bg-white'
                  } ${isCurrent ? 'ring-4 ring-blue-100' : ''}`}
                >
                  {isCompleted && <Check className="size-5 text-white" />}
                </div>
                {index !== timelineSteps.length - 1 && (
                  <div
                    className={`h-1 w-full ${
                      isCompleted && index < currentIndex
                        ? 'bg-blue-500'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  isCompleted ? 'text-blue-600' : 'text-slate-500'
                }`}
              >
                {step}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
