export default function Hero() {
  return (
    <section className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-lime-200" />
          Marketplace-ready agents • pay-per-use • creator payouts
        </div>

        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Monetize AI Agents Instantly
        </h1>

        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-zinc-300/90 sm:text-lg">
          Use powerful agents on demand—and earn by publishing your own.
          CRWDAGENT makes it simple to run, share, and monetize AI workflows
          with pay‑per‑use pricing.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Explore Agents
          </a>
          <div className="text-sm text-zinc-400">
            No-code friendly • Usage-based • Built for teams & creators
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-fuchsia-400/10 blur-3xl" />
          </div>
          <div className="relative space-y-4">
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-300/90">
              LIVE PREVIEW
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-50">
                    Run agent
                  </div>
                  <div className="text-xs text-zinc-400">
                    get results in seconds
                  </div>
                </div>
                <div className="rounded-full bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-950">
                  /run
                </div>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-zinc-50">
                    Pay per use
                  </div>
                  <div className="text-xs text-zinc-400">priced by value</div>
                </div>
                <div className="text-sm font-semibold tabular-nums text-zinc-50">
                  $0.09
                  <span className="text-zinc-300/90">/credit</span>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-sm font-semibold text-zinc-50">
                  Creator monetization
                </div>
                <div className="mt-1 text-xs leading-5 text-zinc-400">
                  Publish an agent, set pricing, and get paid as users run your
                  workflow.
                </div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              Designed for high-trust, low-friction adoption.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

