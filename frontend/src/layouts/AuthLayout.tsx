import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(22,163,74,0.12),_transparent_22%),linear-gradient(180deg,_#f8fafc_0%,_#eff6ff_46%,_#ecfeff_100%)] px-6 py-10 md:px-8 md:py-14">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl gap-8 rounded-10 border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-200/70 backdrop-blur md:grid-cols-[1.15fr_0.85fr] md:items-center md:p-10">
        <div className="relative overflow-hidden rounded-10 border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.12),_transparent_24%),linear-gradient(135deg,_#ffffff_0%,_#f8fafc_55%,_#eff6ff_100%)] p-8 shadow-xl shadow-slate-200/60 md:p-10">
          <div className="relative max-w-2xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">
              Secure Access
            </p>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-5xl">
              Masuk untuk mulai belanja ikan segar dan akses marketplace dengan lebih mudah.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Login atau buat akun untuk menjelajahi katalog, melihat detail produk,
              mengelola pesanan, dan menikmati pengalaman marketplace yang cepat dan nyaman.
            </p>
            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="rounded-10 border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                  Marketplace
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Temukan produk ikan, cek detailnya, lalu lanjutkan ke checkout dengan alur yang praktis.
                </p>
              </div>
              <div className="rounded-10 border border-slate-200 bg-white/80 p-4 shadow-sm shadow-slate-200/70">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Akses Akun
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Pantau aktivitas akun dan nikmati akses yang lebih personal setelah berhasil masuk.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
