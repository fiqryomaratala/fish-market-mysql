import { useRef, type ChangeEvent } from 'react'
import { LoaderCircle, UserRound } from 'lucide-react'

const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

type ProfileAvatarUploadProps = {
  name: string
  photoUrl?: string
  isUploading: boolean
  onUpload: (file: File) => Promise<void>
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function isValidFileType(file: File) {
  if (ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
    return true
  }

  return /\.(jpe?g|png|webp)$/i.test(file.name)
}

export function ProfileAvatarUpload({
  name,
  photoUrl,
  isUploading,
  onUpload,
}: ProfileAvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleOpenFilePicker = () => {
    if (isUploading) {
      return
    }

    inputRef.current?.click()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    if (!isValidFileType(selectedFile)) {
      window.alert('Format file harus JPG, JPEG, PNG, atau WEBP.')
      event.target.value = ''
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      window.alert('Ukuran file maksimal 2MB.')
      event.target.value = ''
      return
    }

    try {
      await onUpload(selectedFile)
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="shrink-0 text-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleFileChange(event)}
      />

      <div className="profile-subcard relative mx-auto flex size-24 items-center justify-center overflow-hidden rounded-full border border-slate-100 bg-slate-50">
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center rounded-full bg-blue-600 text-xl font-semibold text-white">
            {name.trim() ? getInitials(name) : <UserRound className="size-9" />}
          </div>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 backdrop-blur-[1px]">
            <LoaderCircle className="size-6 animate-spin text-white" />
          </div>
        ) : null}
      </div>

      <span
        role="button"
        tabIndex={0}
        onClick={handleOpenFilePicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleOpenFilePicker()
          }
        }}
        aria-disabled={isUploading}
        className={`mt-3 inline-block text-sm font-medium transition ${
          isUploading
            ? 'cursor-not-allowed text-slate-300'
            : 'cursor-pointer text-sky-600 hover:text-sky-700 hover:underline'
        }`}
      >
        Edit
      </span>
    </div>
  )
}
