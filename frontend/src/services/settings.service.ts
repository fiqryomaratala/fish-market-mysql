import api from '@/api/axios'
import type {
  ChangePasswordData,
  ProfileData,
  SettingsData,
  SettingsResponse,
  SettingsUpdateData,
  SystemInfo,
  UpdateProfileData,
} from '@/types/settings'

const SETTINGS_STORAGE_KEY = 'admin-settings'

const DEFAULT_SETTINGS: SettingsData = {
  application_name: 'FishMarket App',
  company_name: 'Fish Market',
  company_email: 'admin@fishmarket.com',
  company_phone: '+62 812-0000-0000',
  company_address: 'Jakarta, Indonesia',
  logo_url: '',
  order_notifications: true,
  inventory_notifications: true,
  harvest_notifications: true,
  user_notifications: true,
  email_notifications: false,
  maintenance_mode: false,
  auto_refresh_dashboard: true,
  enable_activity_logs: true,
  enable_audit_trail: true,
}

type ProfileApiResponse = {
  success: boolean
  message: string
  data: {
    id: number
    name: string
    email: string
    phone?: string
    address?: string
    role: string
    photo_url?: string
    created_at: string
    updated_at?: string
  }
}

function readStoredSettings() {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS
  }

  const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY)

  if (!rawValue) {
    return DEFAULT_SETTINGS
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<SettingsData>

    return {
      ...DEFAULT_SETTINGS,
      ...parsedValue,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

function writeStoredSettings(settings: SettingsData) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

function buildSystemInfo(): SystemInfo {
  return {
    application_version: 'v1.0.0',
    environment: import.meta.env.MODE,
    database_status: 'connected',
    last_backup_date: '-',
  }
}

function mapProfile(profile: ProfileApiResponse['data']): ProfileData {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    avatar_url: profile.photo_url ?? '',
    role: profile.role,
    created_at: profile.created_at,
    updated_at: profile.updated_at ?? profile.created_at,
  }
}

class SettingsService {
  async getSettings() {
    const { data } = await api.get<ProfileApiResponse>('/profile')
    const storedSettings = readStoredSettings()

    return {
      success: true,
      message: data.message || 'Pengaturan berhasil dimuat',
      data: {
        settings: this.convertObjectToSettings(storedSettings).map((setting, index) => ({
          id: index + 1,
          key: setting.key,
          value: setting.value,
          created_at: data.data.created_at,
          updated_at: data.data.updated_at ?? data.data.created_at,
        })),
        profile: mapProfile(data.data),
        system_info: buildSystemInfo(),
      },
    } satisfies SettingsResponse
  }

  async updateSettings(payload: SettingsUpdateData) {
    const mergedSettings: SettingsData = {
      ...readStoredSettings(),
      ...payload,
    }

    writeStoredSettings(mergedSettings)

    return {
      success: true,
      message: 'Pengaturan berhasil disimpan',
      data: mergedSettings,
    }
  }

  async updateProfile(payload: UpdateProfileData) {
    const { data } = await api.put('/profile', payload)
    return data
  }

  async changePassword(payload: ChangePasswordData) {
    const { data } = await api.put('/profile/password', payload)
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
