"use client";

import { useMemo, useState } from "react";
import { Compass, PanelLeftClose, PanelLeftOpen, User } from "lucide-react";
import AgentRunModal from "../../components/AgentRunModal";
import { AGENTS, getAgentById, type Agent } from "../../lib/agents";

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

function navLabel(key: NavKey) {
  return key === "my" ? "My Agents" : "Explore Agents";
}

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
  const [navOpen, setNavOpen] = useState(true);
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
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [modalPrompt, setModalPrompt] = useState("");

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
    setModalOpen(true);
  }

  function closeRunModal() {
    setModalOpen(false);
    setActiveAgentId(null);
  }

  const sidebarWidth = navOpen ? "w-64" : "w-16";
  const mainOffset = navOpen ? "md:pl-72" : "md:pl-24";

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 -top-28 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-400/18 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.zinc.50)_1px,transparent_0)] [background-size:18px_18px]" />

      <aside
        className={[
          "hidden md:block fixed inset-y-0 left-0 z-20 border-r border-white/10 bg-white/[0.04] shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-[width] duration-500 ease-in-out will-change-[width]",
          sidebarWidth,
        ].join(" ")}
      >
        <div className="h-full overflow-hidden">
          <div className="flex items-center justify-between px-4 py-4">
            <div className={navOpen ? "block" : "hidden"}>
              <div className="text-xs font-semibold tracking-[0.22em] text-zinc-300/90">
                CRWDAGENT
              </div>
              <div className="mt-1 text-sm font-semibold text-zinc-50">
                Dashboard
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200 transition-colors hover:bg-white/10"
              aria-label={navOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {navOpen ? (
                <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
              ) : (
                <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>

          <nav className="px-4 pb-4">
            {(["my", "explore"] as NavKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={[
                  "flex w-full items-center rounded-2xl py-3 text-sm",
                  navOpen ? "gap-3 px-3 justify-start" : "px-0 justify-center",
                  active === key
                    ? "bg-white/10 text-zinc-50"
                    : "text-zinc-300",
                ].join(" ")}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5 text-zinc-200">
                  {key === "my" ? (
                    <User className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Compass className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={[
                    "truncate font-medium transition-all duration-500 ease-in-out",
                    navOpen ? "opacity-100 translate-x-0" : "hidden",
                  ].join(" ")}
                >
                  {navLabel(key)}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div
        className={[
          "relative w-full px-4 py-6 sm:px-6 sm:py-10 transition-[padding] duration-500 ease-in-out",
          mainOffset,
        ].join(" ")}
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
          <header className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold tracking-[0.22em] text-zinc-200/90 md:hidden">
                CRWDAGENT
              </div>
              <h1 className="mt-1 text-balance text-2xl font-semibold tracking-tight sm:text-4xl">
                {active === "my" ? "My Agents" : "Explore Agents"}
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-300/90">
                {active === "my"
                  ? "Run agents you own and manage your collection."
                  : "Browse available agents and add them to your dashboard."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:bg-white/10 sm:inline-flex"
                disabled
                title="Coming soon"
              >
                Create Agent (Coming soon)
              </button>
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

          {active === "explore" ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          ) : ownedAgents.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm">
              <div className="text-lg font-semibold tracking-tight">
                No agents added yet
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-300/90">
                Switch to Explore Agents and add one to get started.
              </div>
              <button
                type="button"
                onClick={() => setActive("explore")}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-zinc-50 px-6 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white"
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
        </div>
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

