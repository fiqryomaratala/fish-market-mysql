import { usePageTitle } from '@/hooks/usePageTitle'

type PagePlaceholderProps = {
  title: string
  description: string
  eyebrow: string
}

export function PagePlaceholder({
  title,
  description,
  eyebrow,
}: PagePlaceholderProps) {
  usePageTitle(title)

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
          {eyebrow}
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">Status</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">Ready to build</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Routing, layout, and page boundary are already connected.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Suggested next step
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-900">Connect REST API</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Use `src/api`, `src/services`, and `src/store` for feature logic.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Architecture
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-900">Scalable by domain</p>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Pages are lazy loaded and grouped by public, customer, and admin flow.
          </p>
        </div>
      </div>
    </section>
  )
}
