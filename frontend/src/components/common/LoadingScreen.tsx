type LoadingScreenProps = {
  message?: string
}

export function LoadingScreen({
  message = 'Loading fish marketplace experience...',
}: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-400/30 border-t-cyan-300" />
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-200">
            Fish Market System
          </p>
          <p className="text-sm text-slate-300">{message}</p>
        </div>
      </div>
    </div>
  )
}
