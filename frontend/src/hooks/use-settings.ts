import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { settingsService } from '@/services/settings.service'
import type {
  SettingsUpdateData,
  UpdateProfileData,
  ChangePasswordData,
  NotificationSettingsData,
  SystemSettingsData
} from '@/types/settings'

const QUERY_KEYS = {
  settings: ['settings'] as const,
  profile: ['profile'] as const,
  systemInfo: ['systemInfo'] as const
}

export function useSettings() {
  const { toast } = useToast()

  return useQuery({
    queryKey: QUERY_KEYS.settings,
    queryFn: async () => {
      try {
        const response = await settingsService.getSettings()
        return response.data
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal memuat pengaturan'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    refetchOnWindowFocus: false
  })
}

export function useUpdateSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SettingsUpdateData) => {
      try {
        const response = await settingsService.updateSettings(data)
        return response
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal menyimpan pengaturan'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Berhasil',
        description: response.message || 'Pengaturan berhasil disimpan'
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings })
    }
  })
}

export function useUpdateGeneralSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SettingsUpdateData) => {
      try {
        const response = await settingsService.updateSettings(data)
        return response
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal menyimpan pengaturan umum'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Berhasil',
        description: response.message || 'Pengaturan umum berhasil disimpan'
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings })
    }
  })
}

export function useUpdateProfile() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      try {
        const response = await settingsService.updateProfile(data)
        return response
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal menyimpan profil'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Berhasil',
        description: response.message || 'Profil berhasil diperbarui'
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile })
    }
  })
}

export function useChangePassword() {
  const { toast } = useToast()

  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      try {
        const response = await settingsService.changePassword(data)
        return response
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal mengubah password'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Berhasil',
        description: response.message || 'Password berhasil diubah'
      })
    }
  })
}

export function useUpdateNotificationSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: NotificationSettingsData) => {
      try {
        const response = await settingsService.updateSettings(data)
        return response
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal menyimpan pengaturan notifikasi'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Berhasil',
        description: response.message || 'Pengaturan notifikasi berhasil disimpan'
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings })
    }
  })
}

export function useUpdateSystemSettings() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SystemSettingsData) => {
      try {
        const response = await settingsService.updateSettings(data)
        return response
      } catch (error: any) {
        const message = error.response?.data?.message || 'Gagal menyimpan pengaturan sistem'
        toast({
          variant: 'destructive',
          title: 'Error',
          description: message
        })
        throw error
      }
    },
    onSuccess: (response) => {
      toast({
        title: 'Berhasil',
        description: response.message || 'Pengaturan sistem berhasil disimpan'
      })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.settings })
    }
  })
}
