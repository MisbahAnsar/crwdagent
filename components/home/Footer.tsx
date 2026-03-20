import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

function LogoBadge() {
  return (
    <div className="hidden absolute right-[6rem] top-1/2 size-32 -translate-y-1/2 items-center justify-center rounded-3xl border-3 border-white/30 bg-white/90 p-4 backdrop-blur xl:flex">
      <div className="grid h-16 w-16 rotate-6 grid-cols-2 gap-1.5 rounded-2xl bg-black p-2.5 backdrop-blur">
        <span className="h-5 w-5 rounded-full bg-white" />
        <span className="h-5 w-5 rounded-full bg-red-500" />
        <span className="h-5 w-5 rounded-full bg-red-500" />
        <span className="h-5 w-5 rounded-full bg-white" />
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-zinc-600 hover:text-zinc-900 transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6">
      <div className="bg-white/60 w-full rounded-3xl border border-zinc-200 p-2">
        <div className="relative min-h-[18rem] w-full overflow-hidden rounded-2xl border border-zinc-200 sm:h-[20rem]">
          <div className="absolute inset-0">
            <Image
              alt="Footer background"
              src="/newbg.jpg"
              fill
              priority={false}
              className="h-full w-full rotate-180 object-cover blur-[1px] md:blur-[2px]"
            />
          </div>

          <LogoBadge />

          <div className="relative z-10 flex h-full flex-col items-start justify-between px-4 pt-2 pb-2 sm:justify-center sm:pb-4 md:px-8">
            <div className="relative flex flex-col items-start justify-start">
              <p className="mt-2 max-w-xl text-left text-xl font-semibold tracking-tight text-white sm:mt-3 sm:text-2xl md:text-4xl">
                Ready to run AI agents instantly?
              </p>
              <p className="max-w-xl pt-2 text-left text-xs text-neutral-200 sm:pt-3 sm:text-sm">
                Explore agents in the marketplace, add your favorites, then run
                them from your dashboard. Clean, fast, and built for
                pay-per-use workflows.
              </p>
            </div>

            <div className="mt-4 flex w-full flex-row flex-wrap items-stretch justify-center gap-2 sm:mt-6 md:items-start md:justify-start md:gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 w-full sm:w-auto"
              >
                Explore Agents
              </Link>
              <Link
                href="/my-agents"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-zinc-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-white w-full sm:w-auto"
              >
                My Agents
              </Link>
            </div>

            <div className="mt-6 text-xs text-zinc-300">
              © {new Date().getFullYear()} CRWDAGENT
            </div>
          </div>
        </div>

      {/* Links section */}
      <div className="px-4 pt-12 pb-2 md:pb-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center">
                <div className="flex items-center justify-center">
                  <div className="grid h-10 w-10 grid-cols-2 gap-2 rounded-3xl bg-zinc-900 p-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>
              <p className="mb-4 text-sm text-zinc-600">
                Run and monetize AI agents with a clean marketplace + dashboard.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Components</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="/marketplace">Marketplace</FooterLink>
                <FooterLink href="/dashboard">Dashboard</FooterLink>
                <FooterLink href="/my-agents">My Agents</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Resources</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="/api/agents/trading">Trading Agent API</FooterLink>
                <FooterLink href="/api/agents/content">Content Agent API</FooterLink>
                <FooterLink href="/api/agents/resume">Resume Agent API</FooterLink>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-semibold">Community</h4>
              <ul className="space-y-3 text-sm">
                <FooterLink href="/dashboard">Get started</FooterLink>
                <FooterLink href="/marketplace">Browse agents</FooterLink>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <p className="text-sm text-zinc-500">
                © {new Date().getFullYear()} CRWDAGENT. Built for creators.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}

