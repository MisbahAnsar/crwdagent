export default function CtaSection() {
  return (
    <section aria-label="Call to action" className="pt-2">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm sm:p-10">
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        </div>

        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to explore the marketplace?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300/90 sm:text-base">
              Discover agents you can run instantly—or publish one and start
              earning from day one.
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-zinc-50 px-6 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            Explore Agents
          </a>
        </div>
      </div>
    </section>
  );
}

