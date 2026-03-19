type Props = {
  children: React.ReactNode;
};

export default function PageShell({ children }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7ff] text-zinc-950">
      <div className="relative mx-auto w-full max-w-6xl px-6 py-14 sm:px-10 sm:py-16">
        {children}
      </div>
    </div>
  );
}

