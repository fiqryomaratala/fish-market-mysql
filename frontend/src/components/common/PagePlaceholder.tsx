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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
          {eyebrow}
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel">
          <p className="panel-label">Status</p>
          <p className="panel-value">Ready to build</p>
          <p className="panel-copy">
            Routing, layout, and page boundary are already connected.
          </p>
        </div>
        <div className="panel">
          <p className="panel-label">Suggested next step</p>
          <p className="panel-value">Connect REST API</p>
          <p className="panel-copy">
            Use `src/api`, `src/services`, and `src/store` for feature logic.
          </p>
        </div>
        <div className="panel">
          <p className="panel-label">Architecture</p>
          <p className="panel-value">Scalable by domain</p>
          <p className="panel-copy">
            Pages are lazy loaded and grouped by public, customer, and admin flow.
          </p>
        </div>
      </div>
    </section>
  )
}
