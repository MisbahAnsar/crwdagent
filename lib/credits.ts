const STORAGE_KEY = "crwdagent:credits:v1";
export const DEFAULT_CREDITS = 10;
export const CREDIT_PER_RUN = 1;

export function getCredits(): number {
  if (typeof window === "undefined") return DEFAULT_CREDITS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw == null) return DEFAULT_CREDITS;
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 0) return DEFAULT_CREDITS;
    return n;
  } catch {
    return DEFAULT_CREDITS;
  }
}

export function setCredits(value: number): void {
  if (typeof window === "undefined") return;
  const n = Math.max(0, Math.floor(value));
  localStorage.setItem(STORAGE_KEY, String(n));
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}
