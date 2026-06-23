import { AlertCircle } from 'lucide-react'
import { useNotification } from '@/hooks'
import type { NotificationItem } from '@/types/notification'
import { getNotificationTypeLabel } from '@/types/notification'
import { formatDate } from '@/utils/format'

type NotificationDetailModalProps = {
  isOpen: boolean
  notificationId?: number | null
  fallbackNotification?: NotificationItem | null
  onClose: () => void
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export function NotificationDetailModal({
  isOpen,
  notificationId,
  fallbackNotification,
  onClose,
}: NotificationDetailModalProps) {
  const notificationQuery = useNotification(notificationId, fallbackNotification)
  const notification = notificationQuery.data ?? fallbackNotification ?? null

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-300/40 scrollbar-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-600">
              Detail Notifikasi
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              {notification?.title ?? 'Detail Notifikasi'}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Informasi lengkap notifikasi dari backend.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            Tutup
          </button>
        </div>

        {notificationQuery.isLoading && !notification ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
        ) : !notification ? (
          <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 text-center">
            <div className="rounded-full bg-red-100 p-4 text-red-600">
              <AlertCircle className="size-6" />
            </div>
            <h4 className="mt-4 text-xl font-semibold text-slate-900">
              Gagal memuat detail notifikasi
            </h4>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Detail notifikasi belum tersedia. Silakan coba lagi.
            </p>
            <button
              type="button"
              onClick={() => void notificationQuery.refetch()}
              className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
            <div className="mt-6 space-y-4">
            <DetailField label="Judul" value={notification.title} />
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Pesan</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                {notification.message}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailField label="Tipe" value={getNotificationTypeLabel(notification.type)} />
              <DetailField
                label="Status"
                value={notification.is_read ? 'Sudah Dibaca' : 'Belum Dibaca'}
              />
              <DetailField
                label="Dibuat Pada"
                value={formatDate(notification.created_at, {
                  dateStyle: 'full',
                  timeStyle: 'short',
                })}
              />
              <DetailField label="ID Notifikasi" value={String(notification.id)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
