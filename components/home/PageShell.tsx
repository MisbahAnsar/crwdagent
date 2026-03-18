type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 -top-28 h-[32rem] w-[32rem] rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-[34rem] w-[34rem] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute left-1/2 top-[28rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-lime-300/10 blur-3xl" />
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,theme(colors.zinc.50)_1px,transparent_0)] [background-size:18px_18px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay [background-image:linear-gradient(transparent,rgba(255,255,255,0.06),transparent)]" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-16">
        {children}
      </div>
    </div>
  );
}

