"use client";

import { useCredits } from "./CreditsProvider";

export function CreditsBadge() {
  const { credits } = useCredits();
  return (
    <div
      className="rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm text-zinc-600 shadow-sm"
      suppressHydrationWarning
    >
      <span className="font-semibold tabular-nums text-zinc-900">{credits}</span>{" "}
      credits
    </div>
  );
}
