import { Check } from 'lucide-react'
import { getOrderStatusLabel, type OrderStatus } from '@/types/order-management'

interface OrderTimelineProps {
  currentStatus: string
}

const timelineSteps: OrderStatus[] = [
  'pending',
  'processing',
  'shipping',
  'completed',
]

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const normalizedStatus = currentStatus.trim().toLowerCase()
  const currentIndex = timelineSteps.findIndex((step) => step.toLowerCase() === normalizedStatus)
  const isCancelled = normalizedStatus === 'cancelled'
  const isCompletedOrder = normalizedStatus === 'completed'

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
                      isCompleted ? (isCompletedOrder ? 'bg-green-500' : 'bg-blue-500') : 'bg-slate-200'
                    }`}
                  />
                )}
                <div
                  className={`z-10 flex size-10 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? isCompletedOrder
                        ? 'border-green-500 bg-green-500'
                        : 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 bg-white'
                  } ${isCurrent ? (isCompletedOrder ? 'ring-4 ring-green-100' : 'ring-4 ring-blue-100') : ''}`}
                >
                  {isCompleted && <Check className="size-5 text-white" />}
                </div>
                {index !== timelineSteps.length - 1 && (
                  <div
                    className={`h-1 w-full ${
                      isCompleted && index < currentIndex
                        ? isCompletedOrder
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                        : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium ${
                  isCompleted
                    ? isCompletedOrder
                      ? 'text-green-600'
                      : 'text-blue-600'
                    : 'text-slate-500'
                }`}
              >
                {getOrderStatusLabel(step)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
