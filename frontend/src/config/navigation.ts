import type { NavItem } from '@/types/navigation'

export const publicNavigation: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Cart', path: '/cart' },
  { label: 'Checkout', path: '/checkout' },
  { label: 'Login', path: '/login' },
]

export const customerNavigation: NavItem[] = [
  {
    label: 'Customer Dashboard',
    path: '/customer',
    description: 'Orders, account info, and purchase status.',
  },
]

export const adminNavigation: NavItem[] = [
  { label: 'Admin Dashboard', path: '/admin', description: 'Overview of platform activity.' },
  { label: 'Products', path: '/admin/products', description: 'Manage catalog and pricing.' },
  { label: 'Inventory', path: '/admin/inventory', description: 'Track stock availability.' },
  { label: 'Ponds', path: '/admin/ponds', description: 'Monitor pond operations.' },
  { label: 'Fish Batches', path: '/admin/fish-batches', description: 'Batch lifecycle control.' },
  { label: 'Feeding', path: '/admin/feeding', description: 'Schedule and log feeding.' },
  { label: 'Harvest', path: '/admin/harvest', description: 'Record harvest planning.' },
  { label: 'Orders', path: '/admin/orders', description: 'Process customer orders.' },
  { label: 'Reports', path: '/admin/reports', description: 'Operational reporting.' },
  { label: 'Analytics', path: '/admin/analytics', description: 'Business and farm insights.' },
  { label: 'Notifications', path: '/admin/notifications', description: 'Alerts and announcements.' },
  { label: 'Activity Logs', path: '/admin/activity-logs', description: 'Audit recent activity.' },
]
