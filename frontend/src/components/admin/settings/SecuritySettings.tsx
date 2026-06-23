import { useState } from 'react'
import { Key, ShieldCheck } from 'lucide-react'
import { ChangePasswordModal } from './ChangePasswordModal'

type SecuritySettingsProps = {
  lastLogin?: string
  loginIp?: string
  mfaEnabled?: boolean
}

export function SecuritySettings({ 
  lastLogin = '2026-06-20 14:30:00',
  loginIp = '192.168.1.100',
  mfaEnabled = false 
}: SecuritySettingsProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const securityFeatures = [
    {
      id: 'password-strength',
      title: 'Kekuatan Password',
      description: 'Password Anda telah diperbarui dalam 30 hari terakhir',
      status: 'Baik',
      statusColor: 'text-emerald-600 bg-emerald-50',
      icon: Key,
      action: () => setShowPasswordModal(true),
      actionText: 'Ubah Password'
    },
    {
      id: 'login-history',
      title: 'Riwayat Login',
      description: `Terakhir login: ${lastLogin} dari ${loginIp}`,
      status: 'Aktif',
      statusColor: 'text-cyan-600 bg-cyan-50',
      icon: ShieldCheck,
      action: () => {},
      actionText: 'Lihat Riwayat'
    },
    {
      id: 'mfa',
      title: 'Autentikasi Dua Faktor',
      description: 'Tambahkan lapisan keamanan ekstra ke akun Anda',
      status: mfaEnabled ? 'Aktif' : 'Nonaktif',
      statusColor: mfaEnabled ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-50',
      icon: ShieldCheck,
      action: () => {},
      actionText: mfaEnabled ? 'Nonaktifkan' : 'Aktifkan'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Keamanan</h2>
        <p className="mt-1 text-sm text-slate-500">
          Kelola keamanan akun dan akses aplikasi
        </p>
      </div>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 gap-5">
        {securityFeatures.map((feature) => {
          const Icon = feature.icon
          
          return (
            <div
              key={feature.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-slate-100 p-3">
                    <Icon className="size-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-slate-900">{feature.title}</h3>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${feature.statusColor}`}>
                        {feature.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{feature.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={feature.action}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {feature.actionText}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Password Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Ubah Password</h3>
            <p className="mt-1 text-sm text-slate-500">
              Pastikan password Anda kuat dan unik untuk keamanan maksimal
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700"
          >
            Ubah Password
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Minimal 8 karakter</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Gabungan huruf dan angka</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Minimal 1 simbol</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Tidak sama dengan email</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Perbarui setiap 90 hari</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-700">Jangan gunakan ulang password</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Sesi Aktif</h3>
        <p className="mt-1 text-sm text-slate-500">
          Kelola perangkat yang terhubung ke akun Anda
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <span className="text-xs font-semibold text-slate-600">💻</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Chrome di Windows</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-500">IP: {loginIp}</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">Browser: Chrome 128</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Login: {lastLogin}</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              Hapus Sesi
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-slate-100 p-3">
                <span className="text-xs font-semibold text-slate-600">📱</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Firefox di Android</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-500">IP: 192.168.1.101</span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">Browser: Firefox 125</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Login: 2026-06-20 10:15:00</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
            >
              Hapus Sesi
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
          <p className="text-sm text-slate-600">
            <span className="font-medium">Tips:</span> Hapus sesi dari perangkat yang tidak dikenal
          </p>
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Hapus Semua Sesi
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  )
}
