import { useMemo } from 'react'
import {
  getDefaultPathByRole,
  getNavigationByRole,
  getNotificationsPathByRole,
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
      notificationsPath: getNotificationsPathByRole(role),
      profilePath: getProfilePathByRole(role),
      settingsPath: getSettingsPathByRole(role),
    }),
    [role],
  )
}
