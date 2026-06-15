import { useMemo } from 'react'
import {
  getDefaultPathByRole,
  getNavigationByRole,
  getProfilePathByRole,
  getSettingsPathByRole,
} from '@/config/navigation'
import { useAuth } from '@/hooks/useAuth'

export function useNavigation() {
  const { role } = useAuth()

  return useMemo(
    () => ({
      role,
      items: getNavigationByRole(role),
      homePath: getDefaultPathByRole(role),
      profilePath: getProfilePathByRole(role),
      settingsPath: getSettingsPathByRole(role),
    }),
    [role],
  )
}
