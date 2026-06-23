function LoadingSkeleton() {
  return (
    <section className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-4 sm:p-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-left">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
              </th>
              <th className="px-4 py-3 text-center">
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-slate-200" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-slate-50">
                <td className="px-4 py-4">
                  <div className="size-10 animate-pulse rounded-full bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                </td>
                <td className="px-4 py-4">
                  <div className="mx-auto flex w-fit gap-2">
                    <div className="size-8 animate-pulse rounded-lg bg-slate-200" />
                    <div className="size-8 animate-pulse rounded-lg bg-slate-200" />
                    <div className="size-8 animate-pulse rounded-lg bg-slate-200" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default LoadingSkeleton
