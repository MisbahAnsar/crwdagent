const STORAGE_KEY = "crwdagent:runs:v1";

export type RunsByAgent = Record<string, number>;

export function getRuns(): RunsByAgent {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: RunsByAgent = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof k === "string" && typeof v === "number" && v >= 0) {
        out[k] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function incrementRun(agentId: string): void {
  if (typeof window === "undefined") return;
  const runs = getRuns();
  runs[agentId] = (runs[agentId] ?? 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export function getRunCount(agentId: string): number {
  return getRuns()[agentId] ?? 0;
}

/** 80% to creator, 20% to platform */
export function getCreatorEarnings(runs: number, priceAmount: number): number {
  return Math.round(runs * priceAmount * 0.8 * 100) / 100;
}
