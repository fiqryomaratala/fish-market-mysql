import type { ReactNode } from 'react'
import { usePermission } from '@/hooks/usePermission'

type PermissionGuardProps = {
  children: ReactNode
  fallback?: ReactNode
  permissions?: string[]
  requireAll?: boolean
}

export function PermissionGuard({
  children,
  fallback = null,
  permissions = [],
  requireAll = false,
}: PermissionGuardProps) {
  const { allowed } = usePermission({
    permissions,
    requireAll,
  })

  if (!allowed) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
