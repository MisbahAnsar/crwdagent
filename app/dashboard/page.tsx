"use client";

import { useMemo, useState } from "react";
import { AppSidebar } from "@/components/blocks/whatsapp-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/blocks/sidebar";
import AgentRunModal from "../../components/AgentRunModal";
import { CreditsBadge } from "../../components/CreditsBadge";
import { AGENTS, getAgentById, type Agent } from "../../lib/agents";
import {
  getCreatorEarnings,
  getRuns,
  incrementRun,
} from "../../lib/runs";

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

type NavKey = "my" | "explore";

function getUsage(agent: Agent) {
  switch (agent.id) {
    case "trading":
      return {
        whatItDoes:
          "Analyzes your crypto trading question and returns actionable setups with risk controls.",
        exampleInputs: ["Asset: BTC", "Timeframe: 4H", "Goal: short-term opportunity"],
      };
    case "content":
      return {
        whatItDoes:
          "Generates punchy short-form content with a hook, body, CTA, and hashtags.",
        exampleInputs: ["Topic: AI tools", "Platform: X", "Audience: founders"],
      };
    case "resume":
      return {
        whatItDoes:
          "Turns raw experience into an ATS-friendly resume with strong impact bullets.",
        exampleInputs: ["Role: frontend engineer", "Achievements: paste bullets"],
      };
    case "copilot":
      return {
        whatItDoes:
          "Helps you clarify a goal and gives a practical, step-by-step plan.",
        exampleInputs: ["Goal: focus better", "Constraint: 1 hour/day"],
      };
    default:
      return {
        whatItDoes:
          "Summarizes trending topics into a clean brief with what matters and what to watch.",
        exampleInputs: ["Topic: AI regulation", "Region: US", "Timeframe: this week"],
      };
  }
}


export default function DashboardPage() {
  const [active, setActive] = useState<NavKey>("my");

  const [addedIds, setAddedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return safeParseIds(localStorage.getItem(STORAGE_KEY));
  });

  const addedSet = useMemo(() => new Set(addedIds), [addedIds]);
  const ownedAgents = useMemo(() => {
    const out: Agent[] = [];
    for (const id of addedIds) {
      const a = getAgentById(id);
      if (a) out.push(a);
    }
    return out;
  }, [addedIds]);

  const [promptById, setPromptById] = useState<Record<string, string>>({});
  const [resultById, setResultById] = useState<Record<string, RunState>>({});
  const [runsVersion, setRunsVersion] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [modalPrompt, setModalPrompt] = useState("");

  const runsByAgent = useMemo(
    () => getRuns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runsVersion triggers refresh from localStorage
    [runsVersion],
  );

  function addAgent(agent: Agent) {
    setAddedIds((prev) => {
      if (prev.includes(agent.id)) return prev;
      const next = [...prev, agent.id];
      saveIds(next);
      return next;
    });
  }

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
    setModalKey((k) => k + 1);
    setModalOpen(true);
  }

  function closeRunModal() {
    setModalOpen(false);
    setActiveAgentId(null);
  }

  return (
    <div className="relative min-h-screen bg-zinc-50 text-zinc-950">
      <SidebarProvider>
        <AppSidebar active={active} onActiveChange={setActive} />
        <SidebarInset className="relative p-2">
          {/* Right-side bordered panel — independent from the sidebar */}
          <div className="min-h-full rounded-2xl bg-white border border-black/10 px-4 py-6 sm:px-6 sm:py-10">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-[0.22em] text-zinc-700 md:hidden">
                CRWDAGENT
              </div>
              <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
                {active === "my" ? "My Agents" : "Explore Agents"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                {active === "my"
                  ? "Run agents you own and manage your collection."
                  : "Browse available agents and add them to your dashboard."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CreditsBadge />
              <button
                type="button"
                className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 sm:inline-flex"
                disabled
                title="Coming soon"
              >
                Create Agent (Coming soon)
              </button>
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm">
                <span
                  className="font-semibold text-zinc-900"
                  suppressHydrationWarning
                >
                  {addedIds.length}
                </span>{" "}
                added
              </div>
            </div>
          </header>

          {active === "explore" ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {AGENTS.map((agent) => {
                const isAdded = addedSet.has(agent.id);
                return (
                  <article
                    key={agent.id}
                    className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-colors hover:border-black/15 hover:bg-zinc-50"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-400/15 blur-3xl" />
                      <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-cyan-300/18 blur-3xl" />
                    </div>

                    <div className="relative flex h-full min-h-56 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
                            {agent.name}
                          </h2>
                          <p className="mt-1 text-xs text-zinc-500">
                            by {agent.creator}
                          </p>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
                            {agent.description}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-2xl border border-black/10 bg-zinc-50 px-3 py-2 text-right">
                          <div className="text-sm font-semibold tabular-nums text-zinc-900">
                            {agent.price}
                          </div>
                          <div className="mt-0.5 text-[11px] text-zinc-500">
                            pay‑per‑use
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-4 text-xs text-zinc-600">
                        <span suppressHydrationWarning>
                          Runs: {(runsByAgent[agent.id] ?? 0)}
                        </span>
                        <span suppressHydrationWarning>
                          Earnings: $
                          {getCreatorEarnings(
                            runsByAgent[agent.id] ?? 0,
                            agent.priceAmount,
                          ).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-auto pt-5">
                        <button
                          type="button"
                          onClick={() => addAgent(agent)}
                          disabled={isAdded}
                          className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
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
          ) : ownedAgents.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-10 text-center shadow-sm">
              <div className="text-lg font-semibold tracking-tight">
                No agents added yet
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">
                Switch to Explore Agents and add one to get started.
              </div>
              <button
                type="button"
                onClick={() => setActive("explore")}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
              >
                Explore Agents
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {ownedAgents.map((agent) => {
                const usage = getUsage(agent);
                const result = resultById[agent.id] ?? { status: "idle" };
                return (
                  <article
                    key={agent.id}
                    className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white p-6 shadow-sm transition-colors hover:border-black/15 hover:bg-zinc-50"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-fuchsia-400/15 blur-3xl" />
                      <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-cyan-300/18 blur-3xl" />
                    </div>

                    <div className="relative flex h-full min-h-72 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
                            {agent.name}
                          </h2>
                          <p className="mt-1 text-xs text-zinc-500">
                            by {agent.creator}
                          </p>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600">
                            {agent.description}
                          </p>
                        </div>
                        <div className="shrink-0 rounded-2xl border border-black/10 bg-zinc-50 px-3 py-2 text-right">
                          <div className="text-sm font-semibold tabular-nums text-zinc-900">
                            {agent.price}
                          </div>
                          <div className="mt-0.5 text-[11px] text-zinc-500">
                            pay‑per‑use
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-4 text-xs text-zinc-600">
                        <span suppressHydrationWarning>
                          Runs: {(runsByAgent[agent.id] ?? 0)}
                        </span>
                        <span suppressHydrationWarning>
                          Earnings: $
                          {getCreatorEarnings(
                            runsByAgent[agent.id] ?? 0,
                            agent.priceAmount,
                          ).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-5 rounded-2xl border border-black/10 bg-zinc-50 p-4">
                        <div className="text-xs font-semibold tracking-[0.14em] text-zinc-500">
                          HOW TO USE
                        </div>
                        <div className="mt-2 text-sm font-semibold text-zinc-900">
                          {usage.whatItDoes}
                        </div>
                        <div className="mt-3 space-y-2 text-xs text-zinc-600">
                          <div className="text-[11px] font-semibold text-zinc-700">
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
                            className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800"
                          >
                            Run Agent
                          </button>
                          <button
                            type="button"
                            onClick={() => removeAgent(agent.id)}
                            className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50"
                          >
                            Remove Agent
                          </button>
                        </div>

                        <div
                          className={[
                            "mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white transition-all duration-300",
                            result.status === "success" || result.status === "error"
                              ? "max-h-[520px] opacity-100 translate-y-0 p-4"
                              : "max-h-0 opacity-0 -translate-y-1 p-0 border-transparent",
                          ].join(" ")}
                          aria-live="polite"
                        >
                          {result.status === "error" ? (
                            <div className="text-sm leading-6 text-rose-700 whitespace-pre-wrap">
                              {result.message}
                            </div>
                          ) : result.status === "success" ? (
                            <div className="text-sm leading-7 text-zinc-900 whitespace-pre-wrap [text-wrap:pretty]">
                              {result.text}
                            </div>
                          ) : (
                            <div className="text-sm text-zinc-600">Loading…</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AgentRunModal
        key={modalKey}
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
          if (next.status === "success") {
            incrementRun(activeAgentId);
            setRunsVersion((v) => v + 1);
          }
          setResultById((prev) => ({ ...prev, [activeAgentId]: next }));
        }}
      />
    </div>
  );
}

