 "use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed right-0 left-0 z-[110] mx-auto flex max-w-7xl justify-center top-0 px-2 md:px-20 transition-all duration-300",
        scrolled ? "mt-2" : "mt-0",
      ].join(" ")}
    >
      <div className="w-full">
        <div
          className={[
            "flex w-full items-center justify-between py-2.5 transition-all duration-300 sm:py-3 md:px-4 rounded-xl px-2 sm:rounded-2xl sm:px-4",
            scrolled
              ? "bg-white/90 shadow-sm border border-black/10 backdrop-blur-lg"
              : "bg-white/0 shadow-none border border-transparent",
          ].join(" ")}
        >
          <Link href="/" className="cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900 shadow-sm transform rotate-4">
                <div className="grid grid-cols-2 gap-1">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900 ml-1">
                CRWDAGENT
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10 font-medium text-[14px] text-gray-500">
            <Link
              className="text-gray-900 hover:text-blue-600 transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="hover:text-blue-600 transition-colors"
              href="/marketplace"
            >
              Marketplace
            </Link>
            <Link
              className="hover:text-blue-600 transition-colors"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="group relative flex items-center gap-2.5 bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-[14px] font-medium transition-all shadow-sm active:scale-95 disabled:opacity-70"
            >
              <Wallet
                className="h-4 w-4 group-hover:rotate-12 transition-transform"
                aria-hidden="true"
              />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

