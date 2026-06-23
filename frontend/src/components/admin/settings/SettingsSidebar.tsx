import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Server,
  ChevronRight
} from 'lucide-react'

type MenuItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const menuItems: MenuItem[] = [
  { id: 'general', label: 'Pengaturan Umum', icon: Settings },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'security', label: 'Keamanan', icon: Shield },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'system', label: 'Sistem', icon: Server }
]

type SettingsSidebarProps = {
  activeMenu: string
  onMenuChange: (menuId: string) => void
}

export function SettingsSidebar({ activeMenu, onMenuChange }: SettingsSidebarProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Menu Pengaturan</h2>
        <p className="mt-1 text-sm text-slate-500">
          Kelola semua pengaturan aplikasi di satu tempat
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeMenu === item.id
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onMenuChange(item.id)}
              className={`w-full rounded-lg px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-50 border border-cyan-200 text-cyan-700'
                  : 'border border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${
                    isActive ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Icon className="size-4" />
                  </div>
                  <span className={`font-medium ${
                    isActive ? 'text-cyan-800' : 'text-slate-800'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <ChevronRight className="size-4 text-cyan-600" />
                )}
              </div>
            </button>
          )
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold">Tips:</span> Simpan perubahan setelah mengatur setiap bagian untuk menghindari kehilangan data.
        </p>
      </div>
    </div>
  )
}