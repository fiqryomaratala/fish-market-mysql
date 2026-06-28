import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
  UploadProfilePhotoResponse,
  UserProfile,
} from '@/types/profile'

export const PROFILE_QUERY_KEY = ['profile']

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => profileService.updateProfile(payload),
    onSuccess: (data) => {
      queryClient.setQueryData<UserProfile>(PROFILE_QUERY_KEY, data)
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'activity'] })
      void queryClient.invalidateQueries({ queryKey: ['activity-logs'] })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileService.changePassword(payload),
  })
}

export function useUploadProfilePhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => profileService.uploadProfilePhoto(file),
    onSuccess: (data: UploadProfilePhotoResponse) => {
      queryClient.setQueryData<UserProfile | undefined>(PROFILE_QUERY_KEY, (currentProfile) =>
        currentProfile
          ? {
              ...currentProfile,
              avatar: data.photo_url,
            }
          : currentProfile,
      )
      void queryClient.invalidateQueries({ queryKey: ['admin-dashboard', 'activity'] })
      void queryClient.invalidateQueries({ queryKey: ['activity-logs'] })
    },
  })
}
