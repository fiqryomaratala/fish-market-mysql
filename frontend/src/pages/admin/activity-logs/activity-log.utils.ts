import type { ActivityLog, ActivityModuleFilter } from '@/types/activity-log'
import { formatDate } from '@/utils/format'

type ActivityModuleDefinition = {
  key: ActivityModuleFilter
  label: string
  aliases: string[]
}

const activityModules: ActivityModuleDefinition[] = [
  { key: 'users', label: 'Users', aliases: ['USER', 'USERS'] },
  { key: 'products', label: 'Products', aliases: ['PRODUCT', 'PRODUCTS'] },
  { key: 'inventory', label: 'Inventory', aliases: ['INVENTORY', 'INVENTORIES'] },
  { key: 'ponds', label: 'Ponds', aliases: ['POND', 'PONDS'] },
  { key: 'fish-batches', label: 'Fish Batches', aliases: ['FISH_BATCH', 'FISH_BATCHES'] },
  { key: 'feeding-logs', label: 'Feeding Logs', aliases: ['FEEDING_LOG', 'FEEDING_LOGS'] },
  { key: 'harvests', label: 'Harvests', aliases: ['HARVEST', 'HARVESTS'] },
  { key: 'orders', label: 'Orders', aliases: ['ORDER', 'ORDERS'] },
  { key: 'reports', label: 'Reports', aliases: ['REPORT', 'REPORTS'] },
]

function normalizeKey(value: string) {
  return value.trim().toUpperCase().replace(/[\s-]+/g, '_')
}

export function getModuleDefinition(moduleValue: string) {
  const normalized = normalizeKey(moduleValue)

  return (
    activityModules.find((item) => item.aliases.includes(normalized)) ?? {
      key: normalizeKey(moduleValue).toLowerCase() as ActivityModuleFilter,
      label: moduleValue
        .toLowerCase()
        .split(/[_\s-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
      aliases: [normalized],
    }
  )
}

export function getModuleLabel(moduleValue: string) {
  return getModuleDefinition(moduleValue).label || '-'
}

export function getRoleLabel(roleValue: string) {
  const normalized = roleValue.trim().toLowerCase()

  if (normalized === 'admin') {
    return 'Admin'
  }

  if (normalized === 'staff') {
    return 'Staff'
  }

  if (normalized === 'customer') {
    return 'Customer'
  }

  return '-'
}

export function getActionLabel(actionValue: string) {
  const value = actionValue.trim()

  if (!value) {
    return '-'
  }

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')
}

export function formatActivityDateTime(value: string) {
  return formatDate(value, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatActivityTime(value: string) {
  return formatDate(value, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function matchesActivityDate(log: ActivityLog, dateFilter: string) {
  if (!dateFilter) {
    return true
  }

  const date = new Date(log.created_at)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  return date.toISOString().slice(0, 10) === dateFilter
}

export function isTodayActivity(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const today = new Date()
  return date.toDateString() === today.toDateString()
}
