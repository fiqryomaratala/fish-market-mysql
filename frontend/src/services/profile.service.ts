import api from '@/api/axios'
import type { ApiResponse } from '@/types/auth'
import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
  UploadProfilePhotoResponse,
  UserProfile,
} from '@/types/profile'
import { resolveAssetUrl } from '@/utils/asset'

type ProfileApiShape = Partial<UserProfile> & {
  avatar_url?: string
  photo_url?: string
  phone_number?: string
}

type UploadProfilePhotoApiResponse = {
  status?: string
  message?: string
  data?: {
    photo_url?: string
    avatar_url?: string
  }
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeProfile(profile?: ProfileApiShape): UserProfile {
  return {
    id: toNumber(profile?.id),
    name: toStringValue(profile?.name),
    email: toStringValue(profile?.email),
    phone: toStringValue(profile?.phone ?? profile?.phone_number),
    address: toStringValue(profile?.address),
    avatar: resolveAssetUrl(profile?.avatar ?? profile?.avatar_url ?? profile?.photo_url),
    role: toStringValue(profile?.role),
    created_at: toStringValue(profile?.created_at),
  }
}

class ProfileService {
  async getProfile(): Promise<UserProfile> {
    const { data } = await api.get<ApiResponse<ProfileApiShape>>('/profile')
    return normalizeProfile(data.data)
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const { data } = await api.put<ApiResponse<ProfileApiShape>>('/profile', payload)
    return normalizeProfile(data.data)
  }

  async uploadProfilePhoto(file: File): Promise<UploadProfilePhotoResponse> {
    const formData = new FormData()
    formData.append('photo', file)

    const { data } = await api.post<UploadProfilePhotoApiResponse>('/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return {
      photo_url: resolveAssetUrl(data.data?.photo_url ?? data.data?.avatar_url),
    }
  }

  async changePassword(payload: ChangePasswordPayload) {
    const { data } = await api.put<ApiResponse<null>>('/profile/password', payload)
    return data
  }
}

export const profileService = new ProfileService()
