"use client";

import { useMemo, useState } from "react";
import AgentRunModal from "../../components/AgentRunModal";
import { getAgentById, type Agent } from "../../lib/agents";

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

type RunState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; text: string }
  | { status: "error"; message: string };

type Usage = {
  whatItDoes: string;
  exampleInputs: string[];
};

function getUsage(agent: Agent): Usage {
  switch (agent.id) {
    case "trading":
      return {
        whatItDoes:
          "Analyzes crypto market context from your query and returns a practical trade decision.",
        exampleInputs: [
          "Asset: BTC",
          "Timeframe: 4H",
          "Question: is this a buy or wait?",
        ],
      };
    case "content":
      return {
        whatItDoes:
          "Generates a viral, short-form post with hook, main content, CTA, and hashtags.",
        exampleInputs: ["Topic: AI agents", "Platform: X", "Audience: founders"],
      };
    case "resume":
      return {
        whatItDoes:
          "Turns raw experience into a clean resume summary, impact bullets, and ATS keywords.",
        exampleInputs: ["Role: frontend engineer", "Achievements: (paste here)"],
      };
    case "copilot":
      return {
        whatItDoes:
          "Helps you clarify a goal and provides a step-by-step plan with practical tips.",
        exampleInputs: ["Goal: get fit", "Constraint: 30 minutes/day"],
      };
    default:
      return {
        whatItDoes:
          "Summarizes trending topics into a clear brief with what matters and what to watch.",
        exampleInputs: ["Topic: crypto regulation", "Region: US", "Timeframe: this week"],
      };
  }
}

export default function MyAgentsPage() {
  const [addedIds, setAddedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParseIds(localStorage.getItem(STORAGE_KEY));
  });

  const agents = useMemo(() => {
    const resolved: Agent[] = [];
    for (const id of addedIds) {
      const a = getAgentById(id);
      if (a) resolved.push(a);
    }
    return resolved;
  }, [addedIds]);

  const [promptById, setPromptById] = useState<Record<string, string>>({});
  const [resultById, setResultById] = useState<Record<string, RunState>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [modalPrompt, setModalPrompt] = useState("");

  function removeAgent(id: string) {
    setAddedIds((prev) => {
      const next = prev.filter((x) => x !== id);
      saveIds(next);
      return next;
    });
  }

  function openRunModal(agent: Agent) {
    setActiveAgentId(agent.id);
    setModalPrompt(promptById[agent.id] ?? "");
    setModalOpen(true);
  }

  function closeRunModal() {
    setModalOpen(false);
    setActiveAgentId(null);
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
              My Agents
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300/90 sm:text-base">
              Run the agents you’ve added and keep results in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300">
            <span
              className="font-semibold text-zinc-50"
              suppressHydrationWarning
            >
              {agents.length}
            </span>{" "}
            agents
          </div>
        </header>

        <main className="mt-10">
          {agents.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
              <div className="text-lg font-semibold tracking-tight">
                No agents added yet
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-300/90">
                Head to the Marketplace and add an agent to get started.
              </div>
              <a
                href="/marketplace"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-50 px-6 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white"
              >
                Go to Marketplace
              </a>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {agents.map((agent) => {
                const usage = getUsage(agent);
                const result = resultById[agent.id] ?? { status: "idle" };

                return (
                  <article
                    key={agent.id}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />
                      <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
                    </div>

                    <div className="relative flex h-full min-h-72 flex-col">
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

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                        <div className="text-xs font-semibold tracking-[0.14em] text-zinc-400">
                          HOW TO USE
                        </div>
                        <div className="mt-2 text-sm font-semibold text-zinc-100">
                          {usage.whatItDoes}
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-zinc-300/90">
                          <div className="text-[11px] font-semibold text-zinc-300">
                            Example inputs
                          </div>
                          <ul className="list-disc space-y-1 pl-4">
                            {usage.exampleInputs.map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-auto pt-5">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => openRunModal(agent)}
                            className="inline-flex items-center justify-center rounded-2xl bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white"
                          >
                            Run Agent
                          </button>

                          <button
                            type="button"
                            onClick={() => removeAgent(agent.id)}
                            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-white/10"
                          >
                            Remove Agent
                          </button>
                        </div>

                        <div
                          className={[
                            "mt-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300",
                            result.status === "success" || result.status === "error"
                              ? "max-h-[520px] opacity-100 translate-y-0 p-4"
                              : "max-h-0 opacity-0 -translate-y-1 p-0 border-transparent",
                          ].join(" ")}
                          aria-live="polite"
                        >
                          {result.status === "error" ? (
                            <div className="text-sm leading-6 text-rose-200 whitespace-pre-wrap">
                              {result.message}
                            </div>
                          ) : result.status === "success" ? (
                            <div className="text-sm leading-7 text-zinc-100 whitespace-pre-wrap [text-wrap:pretty]">
                              {result.text}
                            </div>
                          ) : (
                            <div className="text-sm text-zinc-300">Loading…</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      <AgentRunModal
        open={modalOpen}
        agent={activeAgentId ? getAgentById(activeAgentId) ?? null : null}
        endpoint={activeAgentId ? `/api/agents/${activeAgentId}` : null}
        prompt={modalPrompt}
        onPromptChange={(next) => {
          setModalPrompt(next);
          if (!activeAgentId) return;
          setPromptById((prev) => ({ ...prev, [activeAgentId]: next }));
        }}
        onClose={closeRunModal}
        onCompleted={(next) => {
          if (!activeAgentId) return;
          if (next.status === "idle" || next.status === "loading") return;
          setResultById((prev) => ({ ...prev, [activeAgentId]: next }));
        }}
      />
    </div>
  );
}

