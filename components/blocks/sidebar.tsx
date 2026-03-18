"use client";

import * as React from "react";

import { useIsMobile } from "@/components/hooks/use-mobile";
import { cn } from "@/lib/utils";

type SidebarContext = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider.");
  return ctx;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    { defaultOpen = true, open: openProp, onOpenChange, className, children, ...props },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean) => {
        onOpenChange?.(value);
        if (!onOpenChange) _setOpen(value);
      },
      [onOpenChange],
    );

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) setOpenMobile((v) => !v);
      else setOpen(!open);
    }, [isMobile, open, setOpen]);

    const state: SidebarContext["state"] = open ? "expanded" : "collapsed";

    const ctxValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, openMobile, isMobile, toggleSidebar],
    );

    return (
      <SidebarContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={cn("flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

export function Sidebar({
  variant = "float",
  collapsible = "icon",
  open: openProp,
  onOpenChange,
  className,
  children,
}: React.ComponentProps<"div"> & {
  variant?: "float" | "sidebar";
  collapsible?: "icon" | "offcanvas" | "none";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen, isMobile, openMobile, setOpenMobile, state } = useSidebar();
  const effectiveOpen = openProp ?? open;

  React.useEffect(() => {
    if (typeof openProp !== "boolean") return;
    setOpen(openProp);
  }, [openProp, setOpen]);

  void effectiveOpen;
  void onOpenChange;

  if (isMobile) {
    // Minimal mobile behavior: off-canvas overlay.
    const mobileOpen = openMobile;
    return (
      <>
        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60"
            aria-label="Close sidebar"
            onClick={() => setOpenMobile(false)}
          />
        ) : null}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-zinc-950/90 backdrop-blur transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            className,
          )}
        >
          <div className="flex h-full flex-col">{children}</div>
        </div>
      </>
    );
  }

  if (collapsible === "none") {
    return (
      <div className={cn("h-svh w-64 border-r border-white/10", className)}>
        <div className="flex h-full flex-col">{children}</div>
      </div>
    );
  }

  const collapsed = state === "collapsed";
  // Give icons more breathing room when collapsed (without changing icon size).
  const width = collapsed ? "w-20" : "w-64";
  const shell =
    variant === "float"
      ? "p-2"
      : "p-0";

  return (
    <div className="relative hidden md:block">
      <div className={cn("h-svh transition-[width] duration-300 ease-in-out", width)} />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden h-svh transition-[width] duration-300 ease-in-out md:flex",
          width,
          shell,
          className,
        )}
      >
        <div
          data-state={effectiveOpen ? "expanded" : "collapsed"}
          className={cn(
            "flex h-full w-full flex-col overflow-hidden",
            variant === "float"
              ? "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_18px_70px_rgba(0,0,0,0.35)] backdrop-blur"
              : "border-r border-white/10 bg-white/[0.04] backdrop-blur",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      className={cn("relative flex min-h-svh flex-1 flex-col", className)}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", className)}
      {...props}
    />
  );
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <div
      className={cn(
        "px-2 text-xs font-semibold tracking-[0.18em] text-zinc-400",
        collapsed ? "hidden" : "",
        className,
      )}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("relative", className)} {...props} />;
}

export function SidebarMenuButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  const { state } = useSidebar();
  const base =
    "flex w-full items-center gap-2 overflow-hidden rounded-xl p-2 text-left text-sm text-zinc-200 transition-colors hover:bg-white/10 hover:text-zinc-50";
  const collapsed = state === "collapsed";

  return (
    <button
      type="button"
      className={cn(
        base,
        // Collapsed sidebar: show only icons, centered in the rail.
        collapsed ? "justify-center px-0 gap-0 [&>span]:hidden" : "",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("border-t border-white/10 p-2", className)} {...props} />;
}

