"use client";

import * as React from "react";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const DropdownCtx = React.createContext<Ctx | null>(null);

function useDropdown() {
  const ctx = React.useContext(DropdownCtx);
  if (!ctx) throw new Error("DropdownMenu components must be used together.");
  return ctx;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const t = e.target as Node | null;
      if (!t) return;
      if (triggerRef.current?.contains(t)) return;
      if (contentRef.current?.contains(t)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <DropdownCtx.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative">{children}</div>
    </DropdownCtx.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  const { open, setOpen, triggerRef } = useDropdown();
  return (
    <div
      ref={(n) => {
        triggerRef.current = n;
      }}
      className="w-full"
      role="button"
      tabIndex={0}
      onClick={() => setOpen(!open)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(!open);
        }
      }}
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({
  side = "bottom",
  align = "end",
  className = "",
  children,
}: {
  side?: "top" | "bottom";
  align?: "start" | "end";
  className?: string;
  children: React.ReactNode;
}) {
  const { open, contentRef } = useDropdown();
  if (!open) return null;

  const sideCls = side === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const alignCls = align === "start" ? "left-0" : "right-0";

  return (
    <div
      ref={contentRef}
      className={[
        "absolute z-50 min-w-48 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.12)]",
        sideCls,
        alignCls,
        className,
      ].join(" ")}
      role="menu"
    >
      <div className="p-1.5">{children}</div>
    </div>
  );
}

export function DropdownMenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  const { setOpen } = useDropdown();
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
      onClick={() => {
        onSelect?.();
        setOpen(false);
      }}
      role="menuitem"
    >
      {children}
    </button>
  );
}

