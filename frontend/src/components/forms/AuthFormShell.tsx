import type { ReactNode } from 'react'

type AuthFormShellProps = {
  title: string
  description?: string
  children?: ReactNode
}

export function AuthFormShell({
  title,
  description,
  children,
}: AuthFormShellProps) {
  return (
    <div className="w-full rounded-10 border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
          Akun
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">{title}</h1>
        {description ? <p className="text-sm leading-7 text-slate-500">{description}</p> : null}
      </div>
      <div className="mt-6 space-y-3">{children}</div>
    </div>
  )
}
