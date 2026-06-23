import api from '@/api/axios'
import type {
  ChangePasswordData,
  SettingsResponse,
  SettingsUpdateData,
  UpdateProfileData,
} from '@/types/settings'

class SettingsService {
  async getSettings() {
    const { data } = await api.get<SettingsResponse>('/settings')
    return data
  }

  async updateSettings(payload: SettingsUpdateData) {
    const { data } = await api.put('/settings', payload)
    return data
  }

  async updateProfile(payload: UpdateProfileData) {
    const { data } = await api.put('/settings/profile', payload)
    return data
  }

  async changePassword(payload: ChangePasswordData) {
    const { data } = await api.put('/settings/change-password', payload)
    return data
  }

  parseSettingsToObject(settings: Array<{ key: string; value: string }>) {
    const result: Record<string, string | number | boolean> = {}

    settings.forEach((setting) => {
      const { key, value } = setting

      if (value === 'true' || value === 'false') {
        result[key] = value === 'true'
      } else if (!Number.isNaN(Number(value)) && value.trim() !== '') {
        result[key] = Number(value)
      } else {
        result[key] = value
      }
    })

    return result
  }

  convertObjectToSettings(obj: Record<string, unknown>) {
    return Object.entries(obj).map(([key, value]) => ({
      key,
      value: typeof value === 'boolean' ? value.toString() : String(value ?? ''),
    }))
  }
}

export const settingsService = new SettingsService()
