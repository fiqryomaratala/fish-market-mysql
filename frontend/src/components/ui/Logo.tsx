type LogoProps = {
  className?: string
  imageClassName?: string
}

export function Logo({ className = '', imageClassName = '' }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-slate-200/90 bg-white p-1 shadow-[0_6px_18px_rgba(15,23,42,0.08)] ${className}`.trim()}
    >
      <img
        src="/leaf-logo.jpeg"
        alt="Fish Market logo"
        className={`h-11 w-11 rounded-xl object-contain ${imageClassName}`.trim()}
      />
    </div>
  )
}
