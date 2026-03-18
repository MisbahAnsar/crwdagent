"use client";

import { useEffect, useMemo, useState } from "react";
import type { Agent } from "../lib/agents";

type RunState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; text: string }
  | { status: "error"; message: string };

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-900/20 border-t-zinc-900"
    />
  );
}

type Props = {
  open: boolean;
  agent: Agent | null;
  endpoint: string | null;
  prompt: string;
  onPromptChange: (next: string) => void;
  onClose: () => void;
  onCompleted: (result: RunState) => void;
};

export default function AgentRunModal({
  open,
  agent,
  endpoint,
  prompt,
  onPromptChange,
  onClose,
  onCompleted,
}: Props) {
  const [state, setState] = useState<RunState>({ status: "idle" });

  useEffect(() => {
    if (!open) return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const title = useMemo(() => {
    if (!agent) return "Run Agent";
    return `Run ${agent.name}`;
  }, [agent]);

  async function run() {
    const trimmed = prompt.trim();
    if (!trimmed) {
      const next: RunState = {
        status: "error",
        message: "Please enter a prompt first.",
      };
      setState(next);
      onCompleted(next);
      return;
    }

    setState({ status: "loading" });
    try {
      const url = endpoint ?? "/api/agents/copilot";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = (await res.json().catch(() => null)) as
        | { text?: string; error?: string; detail?: string }
        | null;

      if (!res.ok) {
        const message = data?.error ?? "Request failed.";
        const detail = data?.detail ? `\n\n${data.detail}` : "";
        const next: RunState = { status: "error", message: `${message}${detail}` };
        setState(next);
        onCompleted(next);
        return;
      }

      const text = data?.text?.trim();
      if (!text) {
        const next: RunState = {
          status: "error",
          message: "No response text returned.",
        };
        setState(next);
        onCompleted(next);
        return;
      }

      const next: RunState = { status: "success", text };
      setState(next);
      onCompleted(next);
    } catch (e) {
      const next: RunState = {
        status: "error",
        message: e instanceof Error ? e.message : "Unexpected error.",
      };
      setState(next);
      onCompleted(next);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative mx-auto flex min-h-full w-full max-w-2xl items-end px-4 py-6 sm:items-center">
        <div className="relative w-full max-h-[80vh] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-[0_18px_70px_rgba(0,0,0,0.70)] backdrop-blur">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/12 blur-3xl" />
            <div className="absolute -right-20 top-8 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>

          <div className="relative flex max-h-[80vh] flex-col">
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-semibold tracking-[0.18em] text-zinc-400">
                  AGENT RUNNER
                </div>
                <h2 className="mt-2 text-pretty text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
                  {title}
                </h2>
                {agent ? (
                  <p className="mt-2 text-sm leading-6 text-zinc-300/90">
                    {agent.description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition-colors hover:bg-white/10"
              >
                Close
              </button>
            </div>
            </div>

            <div className="scrollbar-thin overflow-y-auto px-6 pb-6 sm:px-7 sm:pb-7">
              <div className="space-y-4">
              <label className="block">
                <div className="text-xs font-medium text-zinc-300">Prompt</div>
                <textarea
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder="Describe what you want the agent to do…"
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] outline-none transition-colors focus:border-cyan-300/40 focus:bg-white/[0.06]"
                />
              </label>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="text-xs text-zinc-400">
                  Tip: be specific about audience, format, and constraints.
                </div>
                <button
                  type="button"
                  onClick={run}
                  disabled={state.status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.25)] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-zinc-200 disabled:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
                >
                  {state.status === "loading" ? (
                    <>
                      <Spinner />
                      Generating…
                    </>
                  ) : (
                    "Run"
                  )}
                </button>
              </div>

              <div
                className={[
                  "mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all duration-300",
                  state.status === "success" || state.status === "error"
                    ? "opacity-100 translate-y-0 p-4"
                    : "max-h-0 opacity-0 -translate-y-1 p-0 border-transparent",
                ].join(" ")}
                aria-live="polite"
              >
                {state.status === "error" ? (
                  <div className="scrollbar-thin max-h-72 overflow-y-auto text-sm leading-6 text-rose-200 whitespace-pre-wrap">
                    {state.message}
                  </div>
                ) : state.status === "success" ? (
                  <div className="scrollbar-thin max-h-72 overflow-y-auto text-sm leading-7 text-zinc-100 whitespace-pre-wrap [text-wrap:pretty]">
                    {state.text}
                  </div>
                ) : (
                  <div className="text-sm text-zinc-300">Loading…</div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

