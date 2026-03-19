export default function CtaSection() {
  return (
    <section aria-label="Call to action" className="pt-2">
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-sm sm:p-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #000 1.5px, transparent 1.5px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-2xl">
            <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to explore the marketplace?
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
              Discover agents you can run instantly—or publish one and start
              earning from day one.
            </p>
          </div>
          <a
            href="/dashboard"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-200/50"
          >
            Explore Agents
          </a>
        </div>
      </div>
    </section>
  );
}

