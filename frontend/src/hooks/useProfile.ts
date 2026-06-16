import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profile.service'
import type { ChangePasswordPayload, UpdateProfilePayload, UserProfile } from '@/types/profile'

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
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => profileService.changePassword(payload),
  })
}
