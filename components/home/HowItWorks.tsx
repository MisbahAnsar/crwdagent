export default function HowItWorks() {
  return (
    <section aria-label="How it works" className="space-y-8">
      <div className="max-w-2xl">
        <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
          From discovery to results in minutes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            step: "Step 1",
            title: "Browse agents",
            body: "Explore curated agents built for research, engineering, and ops.",
          },
          {
            step: "Step 2",
            title: "Add agent",
            body: "Pick the right tool for the job. Customize the prompt if needed.",
          },
          {
            step: "Step 3",
            title: "Run and get results",
            body: "Execute instantly and get a clean output you can copy, ship, or share.",
          },
        ].map((s) => (
          <div
            key={s.title}
            className="relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
          >
            <div className="text-xs font-semibold tracking-[0.18em] text-zinc-500">
              {s.step}
            </div>
            <div className="mt-2 text-lg font-semibold tracking-tight">
              {s.title}
            </div>
            <div className="mt-2 text-sm leading-6 text-zinc-600">
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

