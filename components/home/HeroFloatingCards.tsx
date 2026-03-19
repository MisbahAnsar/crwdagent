export default function HeroFloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[70] hidden xl:block">
      {/* Left card */}
      <div className="absolute bottom-16 left-[-32px] w-64 -rotate-3 rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 text-sm font-semibold tracking-tight text-gray-800">
          Today&apos;s transactions
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-orange-100 text-orange-600">
                <span className="text-[10px] font-bold">+</span>
              </div>
              <div className="flex-1 text-xs font-semibold text-gray-700">
                New agents added
              </div>
              <span className="text-[10px] font-medium text-gray-400">60%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-[60%] bg-blue-500" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded bg-emerald-100 text-emerald-600">
                <span className="text-[10px] font-bold">$</span>
              </div>
              <div className="flex-1 text-xs font-semibold text-gray-700">
                Agent run volume
              </div>
              <span className="text-[10px] font-medium text-gray-400">112%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-full bg-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Right card */}
      <div className="absolute bottom-24 right-[-32px] flex w-64 rotate-3 flex-col rounded-2xl border border-gray-100 bg-white/95 p-5 shadow-xl backdrop-blur-md">
        <div className="mb-4 text-sm font-semibold tracking-tight text-gray-800">
          5 AI Agent categories
        </div>
        <div className="relative flex gap-2">
          <div className="z-10 flex h-14 w-14 rotate-[-5deg] items-center justify-center rounded-2xl border border-gray-100 bg-white text-xl font-bold text-blue-500 shadow-md">
            TR
          </div>
          <div className="-ml-4 z-20 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-center font-bold shadow-md">
            <div className="grid h-6 w-6 grid-cols-2 gap-1">
              <div className="rounded-sm bg-emerald-500" />
              <div className="rounded-sm bg-blue-500" />
              <div className="rounded-sm bg-yellow-500" />
              <div className="rounded-sm bg-red-500" />
            </div>
          </div>
          <div className="-ml-4 z-30 flex h-14 w-14 rotate-[8deg] items-center justify-center rounded-2xl border border-gray-100 bg-white text-xl font-bold text-indigo-600 shadow-md">
            AI
          </div>
        </div>
      </div>
    </div>
  );
}

