import { Link } from 'react-router-dom'
import { PagePlaceholder } from '@/components/common/PagePlaceholder'

function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PagePlaceholder
        eyebrow="404"
        title="Page not found"
        description="The route you requested is not registered in the current frontend scaffold."
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

export default NotFoundPage
