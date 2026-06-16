import { useRef, useState } from 'react'
import { RefreshCcw, ShieldCheck, UserRound, Warehouse, WalletCards } from 'lucide-react'
import { toast } from 'sonner'
import { AccountInfoCard } from '@/components/customer/profile/AccountInfoCard'
import { AddressCard } from '@/components/customer/profile/AddressCard'
import { ChangePasswordModal } from '@/components/customer/profile/ChangePasswordModal'
import { EditProfileForm } from '@/components/customer/profile/EditProfileForm'
import { LoadingSkeleton } from '@/components/customer/profile/LoadingSkeleton'
import { ProfileCard } from '@/components/customer/profile/ProfileCard'
import { SecurityCard } from '@/components/customer/profile/SecurityCard'
import { useAuth, useChangePassword, usePageTitle, useProfile, useUpdateProfile } from '@/hooks'
import type { ChangePasswordPayload, UpdateProfilePayload } from '@/types/profile'

const sectionItems = [
  { id: 'profile', label: 'Profil', icon: UserRound },
  { id: 'security', label: 'Keamanan', icon: ShieldCheck },
  { id: 'address', label: 'Alamat', icon: Warehouse },
  { id: 'account-information', label: 'Informasi Akun', icon: WalletCards },
] as const

type SectionId = (typeof sectionItems)[number]['id']

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

function getLastLoginLabel() {
  return 'Data belum tersedia'
}

function CustomerProfilePage() {
  usePageTitle('Profil Pelanggan')

  const { refreshUser } = useAuth()
  const profileQuery = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const changePasswordMutation = useChangePassword()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('profile')
  const profileSectionRef = useRef<HTMLElement | null>(null)
  const securitySectionRef = useRef<HTMLElement | null>(null)
  const addressSectionRef = useRef<HTMLElement | null>(null)
  const accountInformationSectionRef = useRef<HTMLElement | null>(null)

  const profile = profileQuery.data

  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId)

    const targetRef =
      sectionId === 'profile'
        ? profileSectionRef
        : sectionId === 'security'
          ? securitySectionRef
          : sectionId === 'address'
            ? addressSectionRef
            : accountInformationSectionRef

    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

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

  const handleChangePassword = async (payload: ChangePasswordPayload) => {
    try {
      await changePasswordMutation.mutateAsync(payload)
      setIsPasswordModalOpen(false)
      toast.success('Password berhasil diperbarui.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  if (profileQuery.isLoading) {
    return <LoadingSkeleton />
  }

  if (profileQuery.isError || !profile) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-rose-200 bg-white px-6 py-12 text-center shadow-lg shadow-rose-100/70">
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
          className="mt-6 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600"
        >
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/70">
            <p className="px-3 text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
              Menu Pengaturan
            </p>
            <div className="mt-4 grid gap-2">
              {sectionItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-600 to-emerald-500 text-white shadow-lg shadow-cyan-200'
                        : 'bg-slate-50 text-slate-700 hover:bg-cyan-50 hover:text-sky-700'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <section ref={profileSectionRef} id="profile" className="scroll-mt-24 space-y-6">
            <ProfileCard
              profile={profile}
              onEdit={() => {
                setActiveSection('profile')
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

          <section ref={securitySectionRef} id="security" className="scroll-mt-24">
            <SecurityCard
              onChangePassword={() => {
                setActiveSection('security')
                setIsPasswordModalOpen(true)
              }}
            />
          </section>

          <section ref={addressSectionRef} id="address" className="scroll-mt-24">
            <AddressCard
              address={profile.address}
              onEditAddress={() => {
                setActiveSection('address')
                setIsEditingProfile(true)
                profileSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                })
              }}
            />
          </section>

          <section
            ref={accountInformationSectionRef}
            id="account-information"
            className="scroll-mt-24"
          >
            <AccountInfoCard profile={profile} lastLogin={getLastLoginLabel()} />
          </section>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        isSubmitting={changePasswordMutation.isPending}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={(values) => void handleChangePassword(values)}
      />
    </>
  )
}

export default CustomerProfilePage
