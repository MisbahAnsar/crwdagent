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
        "fixed top-0 inset-x-0 z-[80] transition-all duration-300 py-6",
        scrolled ? "bg-white/90 backdrop-blur border-b border-black/10" : "bg-transparent",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
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

        <div className="hidden md:flex items-center gap-10 font-medium text-[14px] text-gray-500">
          <Link className="text-gray-900 hover:text-blue-600 transition-colors" href="/">
            Home
          </Link>
          <Link className="hover:text-blue-600 transition-colors" href="/marketplace">
            Marketplace
          </Link>
          <Link className="hover:text-blue-600 transition-colors" href="/dashboard">
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
            <Wallet className="h-4 w-4 group-hover:rotate-12 transition-transform" aria-hidden="true" />
            <span>Connect Wallet</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

