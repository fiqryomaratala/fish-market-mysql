import {
  Activity,
  BarChart3,
  Bell,
  Fish,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  Waves,
  Warehouse,
  ClipboardList,
  ChartColumnIncreasing,
  ReceiptText,
} from 'lucide-react'
import type { NavItem } from '@/types/navigation'
import type { UserRole } from '@/types/auth'

export interface PublicNavItem {
  title: string
  path: string
}

export const publicNavigation: PublicNavItem[] = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Products', path: '/products' },
  { title: 'Cart', path: '/cart' },
  { title: 'Checkout', path: '/checkout' },
  { title: 'Login', path: '/login' },
]

export const navigationItems: NavItem[] = [
  { title: 'Marketplace', path: '/customer/marketplace', icon: Store, roles: 'customer' },
  { title: 'Cart', path: '/customer/cart', icon: ShoppingCart, roles: 'customer' },
  { title: 'Orders', path: '/orders', icon: ReceiptText, roles: 'customer' },
  { title: 'Dashboard', path: '/staff', icon: LayoutDashboard, roles: 'staff' },
  { title: 'Pond', path: '/staff/ponds', icon: Waves, roles: 'staff' },
  { title: 'Fish Batches', path: '/staff/fish-batches', icon: Fish, roles: 'staff' },
  { title: 'Feeding Logs', path: '/staff/feeding-logs', icon: ClipboardList, roles: 'staff' },
  { title: 'Harvest', path: '/staff/harvest', icon: Package, roles: 'staff' },
  { title: 'Inventory', path: '/staff/inventory', icon: Warehouse, roles: 'staff' },
  { title: 'Dashboard', path: '/admin', icon: LayoutDashboard, roles: 'admin' },
  { title: 'Pengguna', path: '/admin/users', icon: Users, roles: 'admin' },
  { title: 'Produk', path: '/admin/products', icon: Store, roles: 'admin' },
  { title: 'Inventaris', path: '/admin/inventory', icon: Warehouse, roles: 'admin' },
  { title: 'Kolam', path: '/admin/ponds', icon: Waves, roles: 'admin' },
  { title: 'Batch Ikan', path: '/admin/fish-batches', icon: Fish, roles: 'admin' },
  { title: 'Log Pakan', path: '/admin/feeding-logs', icon: ClipboardList, roles: 'admin' },
  { title: 'Panen', path: '/admin/harvest', icon: Package, roles: 'admin' },
  { title: 'Pesanan', path: '/admin/orders', icon: ReceiptText, roles: 'admin' },
  { title: 'Laporan', path: '/admin/reports', icon: BarChart3, roles: 'admin' },
  { title: 'Analitik', path: '/admin/analytics', icon: ChartColumnIncreasing, roles: 'admin' },
  { title: 'Notifikasi', path: '/admin/notifications', icon: Bell, roles: 'admin' },
  { title: 'Log Aktivitas', path: '/admin/activity-logs', icon: Activity, roles: 'admin' },
  { title: 'Pengaturan', path: '/admin/settings', icon: Settings, roles: 'admin' },
]

export function getNavigationByRole(role: string | null | undefined) {
  return navigationItems.filter((item) => item.roles === role)
}

export function getDefaultPathByRole(role: string | null | undefined) {
  if (role === 'admin') {
    return '/admin'
  }

  if (role === 'staff') {
    return '/staff'
  }

  if (role === 'customer') {
    return '/customer/marketplace'
  }

  return '/'
}

export function getProfilePathByRole(role: string | null | undefined) {
  if (role === 'admin') {
    return '/admin/profile'
  }

  if (role === 'staff') {
    return '/staff/profile'
  }

  return '/customer/profile'
}

export function getSettingsPathByRole(role: string | null | undefined) {
  if (role === 'admin') {
    return '/admin/settings'
  }

  if (role === 'staff') {
    return '/staff/settings'
  }

  return '/customer/settings'
}

export function getRoleLabel(role: UserRole | null) {
  if (role === 'admin') {
    return 'Administrator'
  }

  if (role === 'staff') {
    return 'Staff'
  }

  if (role === 'customer') {
    return 'Customer'
  }

  return 'Tamu'
}
