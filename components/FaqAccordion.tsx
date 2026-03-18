"use client";

import { useId, useMemo, useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: Props) {
  const baseId = useId();
  const ids = useMemo(
    () => items.map((_, i) => `${baseId}-${i}`),
    [baseId, items],
  );

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="space-y-3">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const contentId = `${ids[idx]}-content`;
          const buttonId = `${ids[idx]}-button`;
          return (
            <div
              key={item.question}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]"
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => setOpenIndex((cur) => (cur === idx ? null : idx))}
                className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold tracking-tight text-zinc-50 sm:text-base">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={[
                    "grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-200 transition",
                    isOpen ? "rotate-45" : "rotate-0",
                  ].join(" ")}
                >
                  <span className="text-lg leading-none">+</span>
                </span>
              </button>

              <div
                id={contentId}
                role="region"
                aria-labelledby={buttonId}
                className={[
                  "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                ].join(" ")}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="px-5 pb-5 text-sm leading-6 text-zinc-300/90">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

