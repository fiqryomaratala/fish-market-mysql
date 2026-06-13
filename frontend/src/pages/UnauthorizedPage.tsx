import { Link } from 'react-router-dom'
import { PagePlaceholder } from '@/components/common/PagePlaceholder'

function UnauthorizedPage() {
  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="401"
        title="Unauthorized access"
        description="Akun yang sedang aktif tidak memiliki izin untuk membuka halaman yang kamu tuju."
      />
      <Link
        to="/"
        className="inline-flex rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
      >
        Back to home
      </Link>
    </div>
  )
}

export default UnauthorizedPage
