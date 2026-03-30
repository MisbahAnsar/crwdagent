"use client";

import * as React from "react";
import {
  DEFAULT_CREDITS,
  getCredits,
  setCredits as setCreditsStorage,
} from "@/lib/credits";

type CreditsContextValue = {
  credits: number;
  deductCredit: () => boolean;
  canRun: boolean;
  refresh: () => void;
};

const CreditsContext = React.createContext<CreditsContextValue | null>(null);

export function useCredits(): CreditsContextValue {
  const ctx = React.useContext(CreditsContext);
  if (!ctx) throw new Error("useCredits must be used within CreditsProvider");
  return ctx;
}

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = React.useState(DEFAULT_CREDITS);

  const refresh = React.useCallback(() => {
    setCredits(getCredits());
  }, []);

  React.useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [refresh]);

  const deductCredit = React.useCallback((): boolean => {
    const current = getCredits();
    if (current < 1) return false;
    const next = current - 1;
    setCreditsStorage(next);
    setCredits(next);
    return true;
  }, []);

  const value: CreditsContextValue = React.useMemo(
    () => ({
      credits,
      deductCredit,
      canRun: credits >= 1,
      refresh,
    }),
    [credits, deductCredit, refresh],
  );

  return (
    <CreditsContext.Provider value={value}>{children}</CreditsContext.Provider>
  );
}
