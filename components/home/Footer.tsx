export default function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
      <div className="text-sm text-zinc-400">
        Built for teams who want simple, reliable automation.
      </div>
      <div className="text-xs text-zinc-500">
        © {new Date().getFullYear()} CRWDAGENT
      </div>
    </footer>
  );
}

