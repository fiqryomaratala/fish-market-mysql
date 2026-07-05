import { useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'

type UsePermissionOptions = {
  permissions?: string[]
  requireAll?: boolean
}

export function usePermission(options?: UsePermissionOptions) {
  const {
    permissions,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isCustomer,
    isStaff,
    role,
  } = useAuth()

  const requiredPermissions = useMemo(() => options?.permissions ?? [], [options?.permissions])
  const requireAll = options?.requireAll ?? false

  const allowed = useMemo(() => {
    if (requiredPermissions.length === 0) {
      return true
    }

    if (requireAll) {
      return requiredPermissions.every((permission) => hasPermission(permission))
    }

    return hasAnyPermission(...requiredPermissions)
  }, [hasAnyPermission, hasPermission, requireAll, requiredPermissions])

  return {
    role,
    permissions,
    allowed,
    hasPermission,
    hasAnyPermission,
    isAdmin,
    isStaff,
    isCustomer,
  }
}
