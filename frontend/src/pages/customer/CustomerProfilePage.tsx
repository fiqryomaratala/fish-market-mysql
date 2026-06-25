import { useRef, useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'
import { AddressCard } from '@/components/customer/profile/AddressCard'
import { EditProfileForm } from '@/components/customer/profile/EditProfileForm'
import { LoadingSkeleton } from '@/components/customer/profile/LoadingSkeleton'
import { ProfileCard } from '@/components/customer/profile/ProfileCard'
import {
  useAuth,
  usePageTitle,
  useProfile,
  useUpdateProfile,
  useUploadProfilePhoto,
} from '@/hooks'
import type { UpdateProfilePayload } from '@/types/profile'

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response
    if (typeof response?.data?.message === 'string' && response.data.message) {
      return response.data.message
    }
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Terjadi kesalahan. Silakan coba lagi.'
}

function CustomerProfilePage() {
  usePageTitle('Profil Pelanggan')

  const { refreshUser } = useAuth()
  const profileQuery = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const uploadProfilePhotoMutation = useUploadProfilePhoto()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const profileSectionRef = useRef<HTMLElement | null>(null)
  const addressSectionRef = useRef<HTMLElement | null>(null)

  const profile = profileQuery.data
  const currentPhotoUrl = photoUrl ?? profile?.avatar ?? ''

  const handleUpdateProfile = async (values: UpdateProfilePayload) => {
    try {
      await updateProfileMutation.mutateAsync(values)
      await refreshUser()
      setIsEditingProfile(false)
      toast.success('Profil berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  const handlePhotoUpload = async (file: File) => {
    try {
      const result = await uploadProfilePhotoMutation.mutateAsync(file)
      setPhotoUrl(result.photo_url)
      await refreshUser()
      toast.success('Foto profil berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (profileQuery.isLoading) {
    return <LoadingSkeleton />
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="profile-card flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-rose-200 bg-white px-6 py-12 text-center">
        <div className="rounded-full bg-rose-50 p-5 text-rose-500">
          <RefreshCcw className="size-8" />
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-900">Gagal memuat profil pelanggan</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
          Kami belum bisa mengambil data profil dari backend. Coba ulangi beberapa saat lagi.
        </p>
        <button
          type="button"
          onClick={() => void profileQuery.refetch()}
          className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-600"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <section ref={profileSectionRef} id="profile" className="scroll-mt-24 space-y-6">
          <ProfileCard
            profile={profile}
            avatarUrl={currentPhotoUrl}
            isUploadingPhoto={uploadProfilePhotoMutation.isPending}
            onPhotoUpload={handlePhotoUpload}
            onEdit={() => {
              setIsEditingProfile(true)
            }}
          />

          {isEditingProfile ? (
            <EditProfileForm
              profile={profile}
              isSubmitting={updateProfileMutation.isPending}
              onCancel={() => setIsEditingProfile(false)}
              onSubmit={(values) => void handleUpdateProfile(values)}
            />
          ) : null}
        </section>

        <section ref={addressSectionRef} id="address" className="scroll-mt-24">
          <AddressCard
            address={profile.address}
            onEditAddress={() => {
              setIsEditingProfile(true)
              profileSectionRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              })
            }}
          />
        </section>
      </div>
    </>
  )
}

export default CustomerProfilePage
