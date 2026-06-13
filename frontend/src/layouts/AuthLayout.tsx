import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#082f49_100%)] px-6 py-12">
      <div className="w-full max-w-5xl rounded-[2rem] border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur md:p-10">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Secure Access
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-white">
              Operasikan marketplace ikan dan budidaya dari satu dashboard.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
              Struktur autentikasi ini siap dihubungkan ke backend Gin + JWT
              untuk login, register, refresh token, dan role-based access.
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
