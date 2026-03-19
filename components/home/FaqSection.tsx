import FaqAccordion from "../FaqAccordion";

export default function FaqSection() {
  return (
    <section aria-label="FAQ" className="space-y-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">
          FAQ
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
          Quick answers about CRWDAGENT, pricing, and publishing.
        </p>
      </div>

      <FaqAccordion
        items={[
          {
            question: "Can I run agents on this page?",
            answer:
              "Not yet—this homepage is a preview. The marketplace experience is coming soon.",
          },
          {
            question: "How does pay‑per‑use work?",
            answer:
              "Agents are priced per run/credit so teams pay only for the value they use, not seats.",
          },
          {
            question: "How do creators earn money?",
            answer:
              "Publish an agent, set pricing, and get paid when users run your workflow.",
          },
          {
            question: "Do I need to code to use agents?",
            answer:
              "No. Agents ship with prompts and workflows—add inputs, run, and copy the result.",
          },
        ]}
      />
    </section>
  );
}

