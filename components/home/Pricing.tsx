const PLANS = [
  {
    name: "Starter",
    price: "$0",
    label: "forever",
    description: "For trying out agents and small side projects.",
    features: [
      "Up to 2 active agents",
      "Basic analytics (7 days)",
      "Email support",
      "Public marketplace profile",
      "Community templates access",
      "Standard data retention",
    ],
    highlighted: false,
  },
  {
    name: "Creator",
    price: "$29",
    label: "/month",
    description: "For creators who want to monetize their agents.",
    features: [
      "Unlimited published agents",
      "Priority placement in marketplace",
      "Detailed run analytics (30 days)",
      "Creator payouts dashboard",
      "Custom agent branding",
      "Private agents for clients",
      "Webhook & API access",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    label: "/month",
    description: "For teams running agents in production workflows.",
    features: [
      "Team workspaces & roles",
      "Custom usage limits & SSO",
      "Dedicated success channel",
      "Audit logs & compliance exports",
      "Priority infrastructure region",
      "Onboarding & migration help",
    ],
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section aria-label="Pricing plans" className="py-4">
      <div className="text-center mb-10 px-6">
        <div className="mb-6 inline-block rounded-full border border-gray-200 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 shadow-sm">
          Pricing
        </div>
        <h2 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-gray-900">
          Simple pricing plans
        </h2>
      </div>

      <div className="mx-auto grid max-w-6xl items-stretch gap-6 px-2 sm:px-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={[
              "flex h-full flex-col rounded-[32px] border p-8 transition-all",
              plan.highlighted
                ? "border-transparent bg-zinc-900 text-white shadow-2xl scale-[1.02]"
                : "border-gray-100 bg-gray-50/30 hover:shadow-xl",
            ].join(" ")}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight">
                {plan.name}
              </h3>
              {plan.highlighted && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                  Best for creators
                </span>
              )}
            </div>
            <p
              className={[
                "mt-1 mb-6 text-[13px] leading-6",
                plan.highlighted ? "text-zinc-200" : "text-zinc-600",
              ].join(" ")}
            >
              {plan.description}
            </p>

            <div className="mb-6 mt-2 flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-semibold tabular-nums tracking-tighter">
                {plan.price}
              </span>
              <span
                className={[
                  "text-sm",
                  plan.highlighted ? "text-zinc-300" : "text-zinc-500",
                ].join(" ")}
              >
                {plan.label}
              </span>
            </div>

            <ul
              className={[
                "mt-2 space-y-3 text-[14px]",
                plan.highlighted ? "text-white/90" : "text-gray-600",
              ].join(" ")}
            >
              {plan.features.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className={[
                      "mb-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border-2",
                      plan.highlighted
                        ? "border-white text-white"
                        : "border-gray-900 text-gray-900",
                    ].join(" ")}
                  >
                    <span className="block h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                className={[
                  "inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-[14px] font-medium transition-colors shadow-sm",
                  plan.highlighted
                    ? "bg-white text-gray-900 hover:bg-gray-50"
                    : "bg-blue-600 text-white hover:bg-blue-700",
                ].join(" ")}
              >
                {plan.highlighted ? "Start monetizing" : "Get started"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

