export type SettingItem = {
  id: number
  key: string
  value: string
  created_at: string
  updated_at: string
}

export type SettingsData = {
  application_name?: string
  company_name?: string
  company_email?: string
  company_phone?: string
  company_address?: string
  logo_url?: string
  order_notifications?: boolean
  inventory_notifications?: boolean
  harvest_notifications?: boolean
  user_notifications?: boolean
  email_notifications?: boolean
  maintenance_mode?: boolean
  auto_refresh_dashboard?: boolean
  enable_activity_logs?: boolean
  enable_audit_trail?: boolean
}

export type ProfileData = {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  avatar_url?: string
  role: string
  created_at: string
  updated_at: string
}

export type UpdateProfileData = {
  name: string
  phone?: string
  address?: string
  avatar_url?: string
}

export type ChangePasswordData = {
  current_password: string
  new_password: string
  confirm_password: string
}

export type SettingsResponse = {
  success: boolean
  data: {
    settings: SettingItem[]
    profile: ProfileData
    system_info: {
      application_version: string
      environment: string
      database_status: string
      last_backup_date?: string
    }
  }
  message: string
}

export type SettingsUpdateData = {
  application_name?: string
  company_name?: string
  company_email?: string
  company_phone?: string
  company_address?: string
  logo_url?: string
  order_notifications?: boolean
  inventory_notifications?: boolean
  harvest_notifications?: boolean
  user_notifications?: boolean
  email_notifications?: boolean
  maintenance_mode?: boolean
  auto_refresh_dashboard?: boolean
  enable_activity_logs?: boolean
  enable_audit_trail?: boolean
}

export type NotificationSettingsData = {
  order_notifications: boolean
  inventory_notifications: boolean
  harvest_notifications: boolean
  user_notifications: boolean
  email_notifications: boolean
}

export type SystemSettingsData = {
  maintenance_mode: boolean
  auto_refresh_dashboard: boolean
  enable_activity_logs: boolean
  enable_audit_trail: boolean
}

export type SystemInfo = {
  application_version: string
  environment: string
  database_status: string
  last_backup_date?: string
}