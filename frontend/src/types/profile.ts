export interface UserProfile {
  id: number
  name: string
  email: string
  phone: string
  address: string
  avatar: string
  role: string
  created_at: string
}

export interface UpdateProfilePayload {
  name: string
  phone: string
  address: string
  avatar: string
}

export interface ChangePasswordPayload {
  old_password: string
  new_password: string
}
