"use client";

import { useEffect, useMemo, useState } from "react";
import { AGENTS, type Agent } from "../../lib/agents";

const STORAGE_KEY = "crwdagent:adddedAgents:v1";

function safeParseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function saveIds(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function MarketplacePage() {
  const [addedIds, setAddedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParseIds(localStorage.getItem(STORAGE_KEY));
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(t);
  }, [toast]);

  const addedSet = useMemo(() => new Set(addedIds), [addedIds]);

  function addAgent(agent: Agent) {
    setAddedIds((prev) => {
      if (prev.includes(agent.id)) {
        setToast(`${agent.name} is already in your dashboard.`);
        return prev;
      }
      const next = [...prev, agent.id];
      saveIds(next);
      setToast("Agent added to your dashboard");
      return next;
    });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 -top-28 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-400/18 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.zinc.50)_1px,transparent_0)] [background-size:18px_18px]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-16">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold tracking-[0.22em] text-zinc-200/90">
              CRWDAGENT
            </div>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Marketplace
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300/90 sm:text-base">
              Browse AI agents built by creators. Add your favorites to your
              dashboard—pricing is shown for clarity (no payments yet).
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <a
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-50 px-5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white"
            >
              Dashboard
            </a>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
              <span
                className="font-semibold text-zinc-50"
                suppressHydrationWarning
              >
                {addedIds.length}
              </span>{" "}
              added
            </div>
          </div>
        </header>

        <main className="mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => {
              const isAdded = addedSet.has(agent.id);
              return (
                <article
                  key={agent.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />
                    <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
                  </div>

                  <div className="relative flex h-full min-h-56 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-50">
                          {agent.name}
                        </h2>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-200/90">
                          {agent.description}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                        <div className="text-sm font-semibold tabular-nums text-zinc-50">
                          {agent.price}
                        </div>
                        <div className="mt-0.5 text-[11px] text-zinc-400">
                          pay‑per‑use
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="text-xs text-zinc-400">
                        <span className="text-zinc-200/90">Category:</span>{" "}
                        {agent.id === "trading"
                          ? "Trading"
                          : agent.id === "content"
                            ? "Content"
                            : agent.id === "resume"
                              ? "Career"
                              : agent.id === "copilot"
                                ? "Productivity"
                                : "News"}
                      </div>
                    </div>

                    <div className="mt-auto pt-5">
                      <button
                        type="button"
                        onClick={() => addAgent(agent)}
                        disabled={isAdded}
                        className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-200 disabled:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                      >
                        {isAdded ? "Added" : "Add Agent"}
                      </button>
                      <div className="mt-2 text-center text-[11px] text-zinc-500">
                        Payment coming soon
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>

      <div
        className={[
          "fixed bottom-5 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 transition-all duration-300",
          toast ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2",
        ].join(" ")}
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 shadow-[0_8px_28px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-lime-200" />
            <span className="leading-6">{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

