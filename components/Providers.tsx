"use client";

import { CreditsProvider } from "./CreditsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CreditsProvider>{children}</CreditsProvider>;
}
