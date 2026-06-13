import type { ReactNode } from 'react'

type AuthFormShellProps = {
  title: string
  description: string
  children?: ReactNode
}

export function AuthFormShell({
  title,
  description,
  children,
}: AuthFormShellProps) {
  return (
    <div className="panel w-full max-w-md space-y-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="text-sm leading-6 text-slate-300">{description}</p>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}
