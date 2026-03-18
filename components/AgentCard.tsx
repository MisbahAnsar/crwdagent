 "use client";

import { useMemo, useState } from "react";

type AgentCardProps = {
  name: string;
  description: string;
  price: string;
  cadence?: string;
  interactive?: boolean;
};

function buildThreadPrompt(args: {
  name: string;
  description: string;
  customPrompt: string;
}) {
  const { name, description, customPrompt } = args;
  const agentLabel = `${name} — ${description}`;

  const persona =
    "You are a professional Twitter thread writer. Write a viral thread about AI startups in 2026.";

  const baseRequirements = [
    "Write in a crisp, confident, modern SaaS-founder voice.",
    "Use a strong hook as the first tweet.",
    "Structure as a numbered thread (1/n, 2/n, ...).",
    "Include 1 contrarian insight and 1 practical framework.",
    "Include 2 concrete, plausible examples from 2026 (metrics, products, or go-to-market tactics).",
    "Avoid clichés and generic hype. Make it specific and actionable.",
    "End with a punchy close and a short CTA (e.g., follow/retweet).",
    "Keep it under ~12 tweets.",
  ];

  let angle = "";
  const n = name.toLowerCase();
  const d = description.toLowerCase();

  if (n.includes("signal") || d.includes("trend") || d.includes("competitor")) {
    angle =
      "Angle it around market intelligence: how 2026 AI startups win by shipping faster, tracking signals, and out-learning incumbents. Include a mini-playbook for finding signals and validating them.";
  } else if (
    n.includes("patch") ||
    d.includes("pr") ||
    d.includes("diff") ||
    d.includes("review")
  ) {
    angle =
      "Angle it around engineering velocity: how 2026 AI startups build and ship with agentic code review, CI triage, and quality guardrails. Include a framework for safe automation (policy, tests, blast radius).";
  } else if (
    n.includes("inbox") ||
    d.includes("triage") ||
    d.includes("reply") ||
    d.includes("status")
  ) {
    angle =
      "Angle it around operations and comms: how 2026 AI startups operate with zero-inbox workflows, async updates, and agent-assisted customer comms without losing trust. Include a framework for tone, privacy, and approvals.";
  } else {
    angle =
      "Angle it around product execution: how 2026 AI startups differentiate with narrow agents, measurable outcomes, and pricing that maps to value.";
  }

  const custom = customPrompt.trim()
    ? `User custom prompt:\n${customPrompt.trim()}`
    : "User custom prompt: (none)";

  return [
    persona,
    "",
    `Agent context: ${agentLabel}`,
    angle,
    "",
    ...baseRequirements.map((r) => `- ${r}`),
    "",
    custom,
    "",
    "Output only the thread (no preamble).",
  ].join("\n");
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-900/20 border-t-zinc-900"
    />
  );
}

export default function AgentCard({
  name,
  description,
  price,
  cadence = "/run",
  interactive = true,
}: AgentCardProps) {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prompt = useMemo(
    () => buildThreadPrompt({ name, description, customPrompt }),
    [name, description, customPrompt],
  );

  async function runAgent() {
    if (!interactive) return;
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/agents/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await res.json().catch(() => null)) as
        | { text?: string; error?: string; detail?: string }
        | null;

      if (!res.ok) {
        const message = data?.error ?? "Request failed.";
        setError(data?.detail ? `${message}\n\n${data.detail}` : message);
        return;
      }

      if (!data?.text) {
        setError("No response text returned.");
        return;
      }
      setResult(data.text.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute -left-12 -top-12 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="absolute -right-10 top-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-50">
              {name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-zinc-300/90">
              {description}
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
            <div className="text-sm font-semibold tabular-nums text-zinc-50">
              {price}
              <span className="ml-0.5 font-medium text-zinc-300/90">
                {cadence}
              </span>
            </div>
            <div className="mt-0.5 text-[11px] text-zinc-400">pay-as-you-go</div>
          </div>
        </div>

        {interactive ? (
          <>
            <div className="mt-6 space-y-4">
              <label className="block">
                <div className="text-xs font-medium text-zinc-300">
                  Custom prompt
                </div>
                <input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Optional: add a twist, audience, or niche…"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] outline-none transition-colors focus:border-cyan-300/40 focus:bg-white/[0.06]"
                />
              </label>

              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-zinc-400">
                  <span className="text-zinc-200/90">Latency:</span> ~20–60s
                </div>

                <button
                  type="button"
                  onClick={runAgent}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Generating…
                    </>
                  ) : (
                    "Run Agent"
                  )}
                </button>
              </div>
            </div>

            <div
              className={[
                "mt-5 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300",
                result || error
                  ? "max-h-[520px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-1 p-0 border-transparent",
              ].join(" ")}
              aria-live="polite"
            >
              {error ? (
                <div className="text-sm leading-6 text-rose-200 whitespace-pre-wrap">
                  {error}
                </div>
              ) : result ? (
                <div className="text-sm leading-7 text-zinc-100 whitespace-pre-wrap [text-wrap:pretty]">
                  {result}
                </div>
              ) : (
                <div className="text-sm text-zinc-300">Loading…</div>
              )}
            </div>
          </>
        ) : (
          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-400">
              <span className="text-zinc-200/90">Demo:</span> running agents
              is coming soon
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 shadow-[0_0_0_1px_rgba(255,255,255,0.12)] opacity-80"
            >
              Run Agent
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

