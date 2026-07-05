import type { LucideIcon } from 'lucide-react'
import type { UserRole } from '@/types/auth'

export type NavItem = {
  title: string
  path: string
  icon: LucideIcon
  roles: UserRole
}
