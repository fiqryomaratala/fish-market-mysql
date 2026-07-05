import { X } from 'lucide-react'
import { useState } from 'react'
import { DropdownSelect } from '@/components/common/DropdownSelect'
import type { OrderListItem } from '@/types/order-management'
import { ORDER_STATUS_OPTIONS } from '@/types/order-management'
import { useUpdateOrderStatus } from '@/hooks/useOrderManagement'
import { toast } from 'sonner'

interface OrderStatusModalProps {
  order: OrderListItem | null
  onClose: () => void
}

export function OrderStatusModal({ order, onClose }: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>(
    order?.status || 'Pending'
  )
  const updateStatusMutation = useUpdateOrderStatus()

  if (!order) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await updateStatusMutation.mutateAsync({
        id: order.id,
        payload: { status: selectedStatus },
      })

      toast.success('Status pesanan berhasil diperbarui')
      onClose()
    } catch {
      toast.error('Gagal memperbarui status pesanan')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-900">Update Status Pesanan</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Invoice</p>
            <p className="font-semibold text-slate-900">{order.invoice_number}</p>
          </div>

          <div className="mb-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Pelanggan</p>
            <p className="font-semibold text-slate-900">{order.customer_name}</p>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status Pesanan
            </label>
            <DropdownSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              ariaLabel="Pilih status pesanan"
              options={ORDER_STATUS_OPTIONS.map((status) => ({ label: status, value: status }))}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={updateStatusMutation.isPending}
              className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? 'Menyimpan...' : 'Simpan Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
