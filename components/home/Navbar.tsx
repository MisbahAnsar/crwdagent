export default function Navbar() {
  return (
    <header className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_0_3px_rgba(34,211,238,0.15)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-300 shadow-[0_0_0_3px_rgba(244,114,182,0.15)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-lime-200 shadow-[0_0_0_3px_rgba(190,242,100,0.15)]" />
        </div>
        <div className="text-sm font-semibold tracking-[0.22em] text-zinc-200/90">
          CRWDAGENT
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
          AI Agent Marketplace
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
          Built for teams
        </div>
      </div>
    </header>
  );
}

